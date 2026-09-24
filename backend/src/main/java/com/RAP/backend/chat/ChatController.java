package com.RAP.backend.chat;

import com.RAP.backend.chat.dto.ChatThreadResponse;
import com.RAP.backend.chat.dto.OpenChatRequest;
import com.RAP.backend.chat.dto.SendChatMessageRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chats")
public class ChatController {

	private final ChatService chatService;

	public ChatController(ChatService chatService) {
		this.chatService = chatService;
	}

	@GetMapping
	public List<ChatThreadResponse> mine() {
		return chatService.mine();
	}

	@GetMapping("/{id}")
	public ChatThreadResponse get(@PathVariable UUID id) {
		return chatService.get(id);
	}

	@PostMapping
	public ChatThreadResponse open(@RequestBody OpenChatRequest request) {
		return chatService.open(request == null ? new OpenChatRequest(null, null, null) : request);
	}

	@PostMapping("/{id}/messages")
	public ChatThreadResponse send(@PathVariable UUID id, @RequestBody SendChatMessageRequest request) {
		return chatService.send(id, request == null ? null : request.text());
	}
}
