package com.snapgram.websocket;

import com.snapgram.dto.response.MessageResponse;
import com.snapgram.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage, Principal principal) {
        if (principal == null || chatMessage.getConversationId() == null) return;

        String userId = principal.getName();
        MessageResponse response = messageService.sendMessageWs(chatMessage, userId);

        // Notify all participants except sender
        List<String> participants = messageService.getConversationParticipants(chatMessage.getConversationId());
        for (String participantId : participants) {
            if (!participantId.equals(userId)) {
                messagingTemplate.convertAndSendToUser(participantId, "/queue/messages", response);
            }
        }
    }

    @MessageMapping("/chat.typing")
    public void typing(@Payload ChatMessage chatMessage, Principal principal) {
        if (principal == null || chatMessage.getConversationId() == null) return;

        TypingIndicator indicator = new TypingIndicator();
        indicator.setConversationId(chatMessage.getConversationId());
        indicator.setUserId(principal.getName());
        indicator.setTyping(true);

        messagingTemplate.convertAndSend(
            "/topic/typing/" + chatMessage.getConversationId(), indicator
        );
    }

    @MessageMapping("/chat.seen")
    public void markSeen(@Payload ChatMessage chatMessage, Principal principal) {
        if (principal == null || chatMessage.getConversationId() == null) return;
        messageService.markConversationSeen(chatMessage.getConversationId(), principal.getName());
    }
}
