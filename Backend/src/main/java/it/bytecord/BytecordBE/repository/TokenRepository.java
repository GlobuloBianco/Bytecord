package it.bytecord.BytecordBE.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import it.bytecord.BytecordBE.entities.Token;

public interface TokenRepository extends JpaRepository<Token, Integer> {

  @Query(value = "SELECT t FROM Token t INNER JOIN user u ON t.user.id = u.id WHERE u.id = :id AND (t.expired = false OR t.revoked = false)")
  List<Token> findAllValidTokenByUser(Integer id);
    		  
  Optional<Token> findByToken(String token);
}
