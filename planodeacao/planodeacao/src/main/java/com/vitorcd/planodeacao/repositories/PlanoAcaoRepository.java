package com.vitorcd.planodeacao.repositories;

import com.vitorcd.planodeacao.entity.PlanoAcao;
import com.vitorcd.planodeacao.enums.StatusPlano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanoAcaoRepository extends JpaRepository<PlanoAcao, Long> {

    List<PlanoAcao> findByStatus(StatusPlano status);

    @Query("SELECT p FROM PlanoAcao p LEFT JOIN FETCH p.acoes")
    List<PlanoAcao> findAllWithAcoes();

    @Query("SELECT p FROM PlanoAcao p LEFT JOIN FETCH p.acoes WHERE p.id = :id")
    PlanoAcao findByIdWithAcoes(Long id);


}
