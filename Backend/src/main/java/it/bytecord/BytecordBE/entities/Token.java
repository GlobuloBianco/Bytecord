package it.bytecord.BytecordBE.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Token {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public int id;

  @Column(unique = true)
  public String token;

  @Column(name = "tipo")
  @Enumerated(EnumType.STRING)
  public EnToken enToken = EnToken.BEARER; 

  public boolean revoked; 
  public boolean expired;

  @ManyToOne
  @JoinColumn(name = "user_id")
  public User user;
}
