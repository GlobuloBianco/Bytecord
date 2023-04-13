package it.bytecord.BytecordBE.services;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.bytecord.BytecordBE.entities.Emoji;
import it.bytecord.BytecordBE.repository.EmojiRepository;

@Service
public class EmojiService {

	@Autowired
	private EmojiRepository emojiRepository;

	public String getUserEmojiList(Integer userId) {
		Optional<Emoji> user = emojiRepository.findByUserId(userId);
		if (user.isPresent()) {
			return user.get().getLista();
		} else {
			return null;
		}
	}

	public String updateUserEmojiList(Integer userId, String emojiList) {
	    Optional<Emoji> user = emojiRepository.findByUserId(userId);
	    if (user.isPresent()) {
	        Emoji emoji = user.get();
	        emoji.setLista(emojiList);
	        emojiRepository.save(emoji);
	        
	        return "Salvato con successo";
	    } else {
	        return "Utente non trovato";
	    }
	}
}
