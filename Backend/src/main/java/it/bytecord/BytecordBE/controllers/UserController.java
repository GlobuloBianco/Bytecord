package it.bytecord.BytecordBE.controllers;

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

import it.bytecord.BytecordBE.entities.User;
import it.bytecord.BytecordBE.repository.UserRepository;
import it.bytecord.BytecordBE.security.JwtService;
import it.bytecord.BytecordBE.services.EmojiService;

@Controller
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "${bytecord.fe.baseurl}")
public class UserController {

	@Autowired
	private EmojiService emojiService;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private UserRepository userRepository;

	// ----- Richiesta EmojiList -----//
	@GetMapping("/{userId}/emoji")
	public ResponseEntity<String> getUserEmojiList(@PathVariable Integer userId,
			@RequestHeader("Authorization") String idCaller) {

		Boolean ableTo = checkAccessibility(userId, idCaller);
		if (ableTo) {
			return ResponseEntity.ok(emojiService.getUserEmojiList(userId));
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Non sei autorizzato a vedere liste di altri utenti! >:C");
		}

	}

	// ----- Modifica EmojiList -----//
	@PostMapping("/{userId}/emoji")
	public ResponseEntity<String> updateEmojiList(@PathVariable Integer userId, @RequestBody String emojiList,
			@RequestHeader("Authorization") String idCaller) {

		Boolean ableTo = checkAccessibility(userId, idCaller);
		if (ableTo) {
			return ResponseEntity.ok(emojiService.updateUserEmojiList(userId, emojiList));
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Non sei autorizzato a modificare liste di altri utenti! >:C");
		}
	} 

	// ----- Richiesta Id ----- //
	@GetMapping("/id")
	public Integer getUserId(@RequestHeader("Authorization") String authHeader) {
	    User user = extractUser(authHeader);
	    return user.getId();
	}
	
	// ----- Richiesta Username ----- //
	@GetMapping("/username")
	public String getUsername(@RequestHeader("Authorization") String authHeader) {
	    User user = extractUser(authHeader);
	    return user.getUsername();
	}
	
	// ----- Richiesta Email ----- //
	@GetMapping("/email")
	public String getEmail(@RequestHeader("Authorization") String authHeader) {
	    User user = extractUser(authHeader);
	    return user.getEmail();
	} 
	
	// ----- Richiesta Authorization ----- //
	@GetMapping("/role")
	public String getRole(@RequestHeader("Authorization") String authHeader) {
	    User user = extractUser(authHeader);
	    return user.getEnRole().toString();
	} 
	
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

	// ----- Controllo autorizzazione dell utente ----- //
	private Boolean checkAccessibility(Integer userId, String idCaller) {
		Integer callerId = getUserId(idCaller);// id della persona che fa richiesta http
		if (!userId.equals(callerId)) return false;
		// true autorizzato | false nope
		return true;
	}
}
