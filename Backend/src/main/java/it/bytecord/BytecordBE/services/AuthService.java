package it.bytecord.BytecordBE.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import it.bytecord.BytecordBE.entities.Emoji;
import it.bytecord.BytecordBE.entities.EnRole;
import it.bytecord.BytecordBE.entities.Token;
import it.bytecord.BytecordBE.entities.EnToken;
import it.bytecord.BytecordBE.entities.User;
import it.bytecord.BytecordBE.payload.AuthRequest;
import it.bytecord.BytecordBE.payload.AuthResponse;
import it.bytecord.BytecordBE.payload.SignupRequest;
import it.bytecord.BytecordBE.repository.EmojiRepository;
import it.bytecord.BytecordBE.repository.TokenRepository;
import it.bytecord.BytecordBE.repository.UserRepository;
import it.bytecord.BytecordBE.security.JwtService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	@Autowired
	private UserRepository repository;
	@Autowired
	private TokenRepository tokenRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private EmojiRepository emojiRepository;

	public AuthResponse signup(SignupRequest request) {
		// creazione user
		var user = User.builder().username(request.getUsername()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).enRole(EnRole.USER).build();

		var UserSalvato = repository.save(user);

		// creazione lista emoji e salvataggio
		var emojiList = Emoji.builder().lista("").user(UserSalvato).build();
		var listaSalvata = emojiRepository.save(emojiList);

		var jwtToken = jwtService.generateToken(user);

		saveUserToken(UserSalvato, jwtToken);

		return AuthResponse.builder().token(jwtToken).build();
	}

	public AuthResponse signin(AuthRequest request) {
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		var user = repository.findByUsername(request.getUsername()).orElseThrow();
		var jwtToken = jwtService.generateToken(user);
		revokeAllUserTokens(user);
		saveUserToken(user, jwtToken);

		return AuthResponse.builder().token(jwtToken).build();
	}

	private void saveUserToken(User user, String jwtToken) {
		var token = Token.builder().user(user).token(jwtToken).enToken(EnToken.BEARER).expired(false).revoked(false)
				.build();
		tokenRepository.save(token);
	}

	private void revokeAllUserTokens(User user) {
		var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());

		if (validUserTokens.isEmpty())
			return;

		validUserTokens.forEach(token -> {
			token.setExpired(true);
			token.setRevoked(true);
		});
		tokenRepository.saveAll(validUserTokens);
	}

	public Boolean verify(AuthResponse token) {
		if (token == null || token.getToken() == null) {
			return false;
		}
		return jwtService.isTokenValid(token.getToken());
	}
}
