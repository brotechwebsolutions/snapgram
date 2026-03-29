package com.snapgram.dto.request;
import lombok.Data;
import java.util.List;
@Data
public class PostRequest {
    private String caption;
    private List<String> hashtags;
    private List<String> mentions;
    private String location;
    private boolean isDraft;
    private boolean commentsDisabled;
}
