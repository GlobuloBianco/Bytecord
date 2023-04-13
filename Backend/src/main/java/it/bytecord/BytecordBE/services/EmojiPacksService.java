package it.bytecord.BytecordBE.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.bytecord.BytecordBE.entities.EmojiPacks;
import it.bytecord.BytecordBE.entities.EnPackType;
import it.bytecord.BytecordBE.payload.AuthResponse;
import it.bytecord.BytecordBE.payload.PackRequest;
import it.bytecord.BytecordBE.repository.EmojiPackRepository;


@Service
public class EmojiPacksService {

	@Autowired
	private EmojiPackRepository emojiPacksRepository;
	
	// creazione pack //
	public EmojiPacks createEmojiPack(PackRequest request, String roleType) {
		if (roleType.equals("USER")) {
			var emojiPack = EmojiPacks.builder().nome(request.getNome()).lista(request.getLista()).data(LocalDate.now()).type(EnPackType.PENDING).build();
			emojiPacksRepository.save(emojiPack);
			return emojiPack;
		} else if (roleType.equals("ADMIN")) {
			var emojiPack = EmojiPacks.builder().nome(request.getNome()).lista(request.getLista()).data(LocalDate.now()).type(EnPackType.DEFAULT).build();
			emojiPacksRepository.save(emojiPack);
			return emojiPack;
		}
		return null;
	}
	
	// get all //
	public List<EmojiPacks> getAllPacks() {
		return emojiPacksRepository.findAll();
	}

	// get single //
	public String getEmojiPack(Integer id) {
		Optional<EmojiPacks> pack = emojiPacksRepository.findById(id);
		if (pack.isPresent()) {
			return pack.get().getLista();
		} else {
			return null;
		}
	}
	
	// get by type //
	public List<EmojiPacks> getAllBy(String type) {
		type = type.toUpperCase();
		if (type.equals("DEFAULT")) {

			return emojiPacksRepository.findAllBy(EnPackType.DEFAULT);
		} else if (type.equals("PENDING")) {
			return emojiPacksRepository.findAllBy(EnPackType.PENDING);
		} else if (type.equals("APPROVED")) {
			return emojiPacksRepository.findAllBy(EnPackType.APPROVED);
		} else if (type.equals("REJECTED")) {
			return emojiPacksRepository.findAllBy(EnPackType.REJECTED);
		}
		return null;
	}

	// update //
	public String updateEmojiPacks(Integer id, String pack) {
	    Optional<EmojiPacks> p = emojiPacksRepository.findById(id);
	    if (p.isPresent()) {
	        EmojiPacks foundPack = p.get();
	        foundPack.setLista(pack);
	        emojiPacksRepository.save(foundPack);
	        return "Modificato con successo";
	    } else {
	        return "Emoji pack non trovato";
	    }
	}

	public Object deleteEmojiPack(String request) {
	    Optional<EmojiPacks> p = emojiPacksRepository.findByNome(request);
	    if (p.isPresent()) {
	    	EmojiPacks foundPack = p.get();
	    	emojiPacksRepository.delete(foundPack);
	    	return "Eliminato con successo";
	    } else {
	    	  return "Emoji pack non trovato";
	    }
	}

	public Object updateEmojiPack(String request, String decision) {
	    Optional<EmojiPacks> p = emojiPacksRepository.findByNome(request);
	    if (p.isPresent()) {
	    	EmojiPacks foundPack = p.get();
	    	if(decision.equals("REJECTED")) {
	    		foundPack.setType(EnPackType.REJECTED);
	    		emojiPacksRepository.save(foundPack);
	    	} else if (decision.equals("APPROVED")) {
	    		foundPack.setType(EnPackType.APPROVED);
	    		emojiPacksRepository.save(foundPack);
	    	}
	    	return "Modificato con successo";
	    } else {
	    	  return "Emoji pack non trovato";
	    }
	}
}
