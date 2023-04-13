package it.bytecord.BytecordBE.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import it.bytecord.BytecordBE.entities.EmojiPacks;
import it.bytecord.BytecordBE.entities.EnPackType;


@Repository
public interface EmojiPackRepository extends JpaRepository<EmojiPacks, Integer> {
	Optional<EmojiPacks> findById(Integer id);
	Optional<EmojiPacks> findByNome(String name);
	List<EmojiPacks> findAll();
	
	@Query(value = "SELECT e FROM EmojiPacks e WHERE e.type = :type ")
	List<EmojiPacks> findAllBy(EnPackType type);
	
}
