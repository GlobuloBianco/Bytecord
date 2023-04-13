package it.bytecord.BytecordBE.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import it.bytecord.BytecordBE.entities.EmojiPacks;
import it.bytecord.BytecordBE.entities.User;
import it.bytecord.BytecordBE.payload.PackRequest;
import it.bytecord.BytecordBE.repository.UserRepository;
import it.bytecord.BytecordBE.security.JwtService;
import it.bytecord.BytecordBE.services.EmojiPacksService;

@Controller
@RestController
@RequestMapping("/api/packs")
@CrossOrigin(origins = "${bytecord.fe.baseurl}")
public class EmojiPacksController {

	@Autowired
	private EmojiPacksService emojiPacksService;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private UserRepository userRepository;

	// ----- Richiesta Pack -----//
	@GetMapping("/")
	public ResponseEntity<List<EmojiPacks>> getUserEmojiPack() {
		return ResponseEntity.ok(emojiPacksService.getAllPacks());
	}
	
	@GetMapping("/{type}")
	public ResponseEntity<List<EmojiPacks>> getUserEmojiPack(@PathVariable String type) {
		return ResponseEntity.ok(emojiPacksService.getAllBy(type));
	}

	@PostMapping("/add")
	public ResponseEntity<Object> createEmojiPack(@RequestBody PackRequest request, @RequestHeader("Authorization") String idCaller) {
		String userRole = extractUser(idCaller).getEnRole().toString();
		try {
			return ResponseEntity.ok(emojiPacksService.createEmojiPack(request, userRole));
		} catch (Exception e) {
			return ResponseEntity.ok("Il nome del pack è gia esistente si prega di cambiare");
		}
	}
	
	@PostMapping("/update/{decision}")
	public ResponseEntity<Object> updateEmojiPack(@RequestBody String request, @PathVariable String decision, @RequestHeader("Authorization") String idCaller) {
		String userRole = extractUser(idCaller).getEnRole().toString();
		if(userRole != "ADMIN") {
			return ResponseEntity.ok("Non sei autorizzato a modificare.");
		} else {
			try {
				return ResponseEntity.ok(emojiPacksService.updateEmojiPack(request, decision));
			} catch (Exception e) {
				return ResponseEntity.ok("Errore durante la modifica");
			}
		}
	}
	
	@PostMapping("/delete")
	public ResponseEntity<Object> deleteEmojiPack(@RequestBody String request, @RequestHeader("Authorization") String idCaller) {
		String userRole = extractUser(idCaller).getEnRole().toString();
		if(userRole != "ADMIN") {
			return ResponseEntity.ok("Non sei autorizzato ad eliminare.");
		} else {
			try {
				return ResponseEntity.ok(emojiPacksService.deleteEmojiPack(request));
			} catch (Exception e) {
				return ResponseEntity.ok("Errore durante l'eliminazione");
			}
		}
	}
	
	//methods 
	private User extractUser(String authHeader) {
	    String token = authHeader.replace("Bearer ", "");
	    String username = jwtService.extractUsername(token);
	    Optional<User> user = userRepository.findByUsername(username);
	    if (user.isPresent()) {
	        return user.get();
	    } else {
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
	    }
	}
}
