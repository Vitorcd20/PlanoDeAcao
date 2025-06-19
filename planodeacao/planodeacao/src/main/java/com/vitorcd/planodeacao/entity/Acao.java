package com.vitorcd.planodeacao.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vitorcd.planodeacao.enums.StatusAcao;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;


@Entity
@Data
@Table(name = "acoes")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Acao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Descrição da ação é obrigatória")
    @Column(nullable = false, length = 500)
    private String acao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAcao status = StatusAcao.PENDENTE;

    @NotNull(message = "Prazo é obrigatório")
    @Column(nullable = false)
    private LocalDate prazo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plano_acao_id", nullable = false)
    @JsonIgnore
    private PlanoAcao planoAcao;
}
