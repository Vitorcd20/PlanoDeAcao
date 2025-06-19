package com.vitorcd.planodeacao.dto;

import com.vitorcd.planodeacao.enums.StatusAcao;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcaoDTO {

    @NotBlank(message = "Descrição da ação é obrigatória")
    private String acao;

    @NotNull(message = "Prazo é obrigatório")
    private LocalDate prazo;

    private StatusAcao status;

}
