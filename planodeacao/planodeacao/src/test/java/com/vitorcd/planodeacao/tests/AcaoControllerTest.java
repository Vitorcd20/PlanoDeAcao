package com.vitorcd.planodeacao.tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vitorcd.planodeacao.controllers.AcaoController;
import com.vitorcd.planodeacao.dto.AcaoDTO;
import com.vitorcd.planodeacao.entity.Acao;
import com.vitorcd.planodeacao.enums.StatusAcao;
import com.vitorcd.planodeacao.service.AcaoService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AcaoController.class)
public class AcaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AcaoService acaoService;

    @Autowired
    private ObjectMapper objectMapper;

    private Acao criarAcaoExemplo() {
        Acao acao = new Acao();
        acao.setAcao("Descrição da ação");
        acao.setStatus(StatusAcao.PENDENTE);
        acao.setPrazo(LocalDate.now().plusDays(5));
        return acao;
    }


    @Test
    void deveCriarNovaAcao() throws Exception {
        AcaoDTO acaoDTO = new AcaoDTO(
                "Descrição da ação",
                LocalDate.parse("2025-06-23"),
                StatusAcao.PENDENTE
        );

        Acao acaoCriada = new Acao();
        acaoCriada.setId(1L);
        acaoCriada.setAcao(acaoDTO.getAcao());
        acaoCriada.setStatus(acaoDTO.getStatus());
        acaoCriada.setPrazo(acaoDTO.getPrazo());

        Mockito.when(acaoService.create(eq(1L), any(AcaoDTO.class))).thenReturn(acaoCriada);

        mockMvc.perform(post("/api/planos/1/acoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(acaoDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.acao").value("Descrição da ação"))
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.prazo").value("2025-06-23"));
    }

    @Test
    void deveAtualizarUmaAcao() throws Exception {
        AcaoDTO acaoDTO = new AcaoDTO(
                "Descrição da ação",
                LocalDate.parse("2025-06-30"),
                StatusAcao.PENDENTE
        );
        Acao acaoAtualizada = criarAcaoExemplo();
        acaoAtualizada.setAcao("Nova descrição");

        Mockito.when(acaoService.update(eq(1L), any(AcaoDTO.class))).thenReturn(acaoAtualizada);

        mockMvc.perform(put("/api/acoes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(acaoDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.acao").value("Nova descrição"));
    }

    @Test
    void deveAtualizarStatusDaAcao() throws Exception {
        Acao acaoAtualizada = criarAcaoExemplo();
        acaoAtualizada.setStatus(StatusAcao.CONCLUIDA);
        Mockito.when(acaoService.updateStatus(eq(1L), eq(StatusAcao.CONCLUIDA))).thenReturn(acaoAtualizada);

        mockMvc.perform(patch("/api/acoes/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "CONCLUIDA"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONCLUIDA"));
    }



    @Test
    void deveDeletarUmaAcao() throws Exception {
        mockMvc.perform(delete("/api/acoes/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deveBuscarAcoesPorStatus() throws Exception {
        Acao acao = criarAcaoExemplo();
        Mockito.when(acaoService.findByStatus(StatusAcao.PENDENTE)).thenReturn(List.of(acao));

        mockMvc.perform(get("/api/acoes/status/PENDENTE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDENTE"));
    }
}
