package com.snapgram.service;

import com.snapgram.dto.request.MessageRequest;
import com.snapgram.dto.response.*;
import com.snapgram.exception.AppException;
import com.snapgram.model.*;
import com.snapgram.repository.*;
import com.snapgram.websocket.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    public ConversationResponse getOrCreateConversation(String userId, String otherUserId) {
        // FIX: use findConversationsBetween instead of $size query
        List<Conversation> existing = conversationRepository.findConversationsBetween(userId, otherUserId);
        Optional<Conversation> direct = existing.stream()
            .filter(c -> c.getParticipants().size() == 2)
            .findFirst();
        if (direct.isPresent()) {
            return mapConvToResponse(direct.get(), userId);
        }
        Conversation conv = new Conversation();
        conv.setParticipants(Arrays.asList(userId, otherUserId));
        return mapConvToResponse(conversationRepository.save(conv), userId);
    }

    public List<ConversationResponse> getConversations(String userId) {
        return conversationRepository
            .findByParticipantsContainingOrderByLastMessageAtDesc(userId)
            .stream()
            .map(c -> mapConvToResponse(c, userId))
            .collect(Collectors.toList());
    }

    public MessageResponse sendMessage(
            String convId, String userId, MessageRequest req, MultipartFile media) throws IOException {
        Conversation conv = conversationRepository.findById(convId)
            .orElseThrow(() -> new AppException("Conversation not found", HttpStatus.NOT_FOUND));
        if (!conv.getParticipants().contains(userId)) {
            throw new AppException("You are not a participant of this conversation", HttpStatus.FORBIDDEN);
        }
        Message msg = new Message();
        msg.setConversationId(convId);
        msg.setSenderId(userId);
        msg.setText(req.getText());
        msg.setSharedPostId(req.getSharedPostId());

        if (media != null && !media.isEmpty()) {
            Map<String, String> result = cloudinaryService.uploadImage(media, "messages");
            msg.setMediaUrl(result.get("url"));
        }

        Message saved = messageRepository.save(msg);
        updateConversationLastMessage(conv, userId, req.getText() != null ? req.getText() : "📷 Photo");
        return mapMsgToResponse(saved);
    }

    public MessageResponse sendMessageWs(ChatMessage chatMessage, String userId) {
        Conversation conv = conversationRepository.findById(chatMessage.getConversationId())
            .orElseThrow(() -> new AppException("Conversation not found", HttpStatus.NOT_FOUND));
        if (!conv.getParticipants().contains(userId)) {
            throw new AppException("Not a participant", HttpStatus.FORBIDDEN);
        }
        Message msg = new Message();
        msg.setConversationId(chatMessage.getConversationId());
        msg.setSenderId(userId);
        msg.setText(chatMessage.getText());
        msg.setSharedPostId(chatMessage.getSharedPostId());
        Message saved = messageRepository.save(msg);
        updateConversationLastMessage(conv, userId, chatMessage.getText());
        return mapMsgToResponse(saved);
    }

    public PageResponse<MessageResponse> getMessages(String convId, String userId, int page, int size) {
        Conversation conv = conversationRepository.findById(convId)
            .orElseThrow(() -> new AppException("Conversation not found", HttpStatus.NOT_FOUND));
        if (!conv.getParticipants().contains(userId)) {
            throw new AppException("Not a participant", HttpStatus.FORBIDDEN);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Message> msgs = messageRepository.findByConversationIdOrderByCreatedAtDesc(convId, pageable);
        List<MessageResponse> content = msgs.getContent().stream()
            .filter(m -> !m.getDeletedFor().contains(userId))
            .map(this::mapMsgToResponse)
            .collect(Collectors.toList());

        return PageResponse.<MessageResponse>builder()
            .content(content).page(page).size(size)
            .totalElements(msgs.getTotalElements())
            .hasNext(msgs.hasNext()).hasPrev(page > 0)
            .build();
    }

    public void deleteMessage(String messageId, String userId) {
        Message msg = messageRepository.findById(messageId)
            .orElseThrow(() -> new AppException("Message not found", HttpStatus.NOT_FOUND));
        msg.getDeletedFor().add(userId);
        messageRepository.save(msg);
    }

    public void markConversationSeen(String convId, String userId) {
        List<Message> msgs = messageRepository.findUnseenByConversationId(convId);
        msgs.stream()
            .filter(m -> !m.getSenderId().equals(userId))
            .forEach(m -> { m.setStatus(Message.MessageStatus.SEEN); messageRepository.save(m); });
        conversationRepository.findById(convId).ifPresent(c -> {
            c.getUnreadCount().put(userId, 0);
            conversationRepository.save(c);
        });
    }

    public List<String> getConversationParticipants(String convId) {
        return conversationRepository.findById(convId)
            .map(Conversation::getParticipants)
            .orElse(Collections.emptyList());
    }

    private void updateConversationLastMessage(Conversation conv, String senderId, String text) {
        conv.setLastMessage(text != null ? text : "");
        conv.setLastMessageSenderId(senderId);
        conv.setLastMessageAt(Instant.now());
        conv.getParticipants().stream()
            .filter(p -> !p.equals(senderId))
            .forEach(p -> conv.getUnreadCount().merge(p, 1, Integer::sum));
        conversationRepository.save(conv);
    }

    private ConversationResponse mapConvToResponse(Conversation c, String currentUserId) {
        List<UserResponse> participants = c.getParticipants().stream()
            .map(id -> userService.getUserById(id, currentUserId))
            .collect(Collectors.toList());
        return ConversationResponse.builder()
            .id(c.getId())
            .participants(participants)
            .lastMessage(c.getLastMessage())
            .lastMessageAt(c.getLastMessageAt())
            .unreadCount(c.getUnreadCount().getOrDefault(currentUserId, 0))
            .isPinned(c.getPinnedBy().contains(currentUserId))
            .build();
    }

    private MessageResponse mapMsgToResponse(Message m) {
        return MessageResponse.builder()
            .id(m.getId())
            .conversationId(m.getConversationId())
            .sender(userService.getUserById(m.getSenderId(), null))
            .text(m.getText())
            .mediaUrl(m.getMediaUrl())
            .sharedPostId(m.getSharedPostId())
            .status(m.getStatus())
            .createdAt(m.getCreatedAt())
            .build();
    }
}
