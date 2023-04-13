package it.bytecord.BytecordBE.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.bytecord.BytecordBE.payload.AuthRequest;
import it.bytecord.BytecordBE.payload.AuthResponse;
import it.bytecord.BytecordBE.payload.SignupRequest;
import it.bytecord.BytecordBE.services.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${bytecord.fe.baseurl}")
public class AuthController {

	@Autowired
	private AuthService service;

	@PostMapping("/signup")
	public ResponseEntity<Object> register(@RequestBody SignupRequest request) {
		try {
			return ResponseEntity.ok(service.signup(request));
		} catch (Exception e) {
			return ResponseEntity.ok("Utente già registrato");
		}
	}

	@PostMapping("/signin")
	public ResponseEntity<Object> login(@RequestBody AuthRequest request) {
		try {
			return ResponseEntity.ok(service.signin(request));
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("Credenziali non valide");
		}
	}

	@PostMapping("/verify")
	public ResponseEntity<Boolean> verify(@RequestBody AuthResponse request) {
		return ResponseEntity.ok(service.verify(request));
	}
}