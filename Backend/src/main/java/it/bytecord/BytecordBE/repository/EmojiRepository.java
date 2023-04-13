package it.bytecord.BytecordBE.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.bytecord.BytecordBE.entities.Emoji;

@Repository
public interface EmojiRepository extends JpaRepository<Emoji, Integer> {

	Optional<Emoji> findByUserId(Integer userId);

}
