package com.vitorcd.planodeacao.entity;

import com.vitorcd.planodeacao.enums.StatusAcao;
import com.vitorcd.planodeacao.enums.StatusPlano;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "planos_acao")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlanoAcao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    @Column(nullable = false)
    private String titulo;

    @NotBlank(message = "Objetivo é obrigatório")
    @Column(nullable = false, length = 1000)
    private String objetivo;

    @NotNull(message = "Data é obrigatória")
    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPlano status = StatusPlano.PENDENTE;

    @OneToMany(mappedBy = "planoAcao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Acao> acoes = new ArrayList<>();

    public void verificarEAtualizarStatus() {
        if (acoes.isEmpty()) {
            return;
        }

        boolean todasConcluidas = acoes.stream()
                .allMatch(acao -> acao.getStatus() == StatusAcao.CONCLUIDA);

        if (todasConcluidas) {
            this.status = StatusPlano.CONCLUIDO;
        } else if (this.status == StatusPlano.CONCLUIDO) {
            this.status = StatusPlano.PENDENTE;
        }
    }

}
