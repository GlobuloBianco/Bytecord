package it.bytecord.BytecordBE.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import it.bytecord.BytecordBE.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByUsername(String email);

}

