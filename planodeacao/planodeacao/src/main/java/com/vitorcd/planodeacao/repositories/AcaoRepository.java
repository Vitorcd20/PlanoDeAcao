package com.vitorcd.planodeacao.repositories;

import com.vitorcd.planodeacao.entity.Acao;
import com.vitorcd.planodeacao.enums.StatusAcao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AcaoRepository extends JpaRepository<Acao ,Long> {

    List<Acao> findByPlanoAcaoId(Long planoAcaoId);

    List<Acao> findByStatus(StatusAcao status);

    List<Acao> findByPrazoBeforeAndStatusNot(LocalDate data, StatusAcao status);

    long countByPlanoAcaoIdAndStatus(Long planoAcaoId, StatusAcao status);
}
