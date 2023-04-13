package it.bytecord.BytecordBE.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "user_emoji")
public class Emoji {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "lista_emoji", columnDefinition = "TEXT")
	private String lista;

	@OneToOne 
	@JoinColumn(name = "user_id")
	private User user;

	//constructor
	public Emoji(String lista, User user) {
		this.lista = lista;
		this.user = user; 
		user.setEmoji(this);
	} 
}
