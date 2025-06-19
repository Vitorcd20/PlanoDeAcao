package com.vitorcd.planodeacao.tests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.vitorcd.planodeacao.controllers.PlanoAcaoController;
import com.vitorcd.planodeacao.dto.PlanoAcaoDTO;
import com.vitorcd.planodeacao.entity.PlanoAcao;
import com.vitorcd.planodeacao.enums.StatusPlano;
import com.vitorcd.planodeacao.service.PlanoAcaoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(PlanoAcaoController.class)
public class PlanoAcaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private List<PlanoAcao> listaPlanos;

    @MockBean
    private PlanoAcaoService planoAcaoService;

    @Autowired
    private ObjectMapper objectMapper;

    private PlanoAcaoDTO planoDTO;
    private PlanoAcao planoSalvo;

    @BeforeEach
    void setUp() {
        planoDTO = new PlanoAcaoDTO();
        planoDTO.setTitulo("Plano de Teste");
        planoDTO.setObjetivo("Melhorar performance da equipe");
        planoDTO.setData(LocalDate.of(2025, 6, 30));

        planoSalvo = PlanoAcao.builder()
                .id(1L)
                .titulo(planoDTO.getTitulo())
                .objetivo(planoDTO.getObjetivo())
                .data(planoDTO.getData())
                .status(StatusPlano.PENDENTE)
                .build();
    }

    @Test
    void testCreatePlano_sucesso() throws Exception {
        Mockito.when(planoAcaoService.create(Mockito.any(PlanoAcaoDTO.class)))
                .thenReturn(planoSalvo);

        mockMvc.perform(post("/api/planos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(planoDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.titulo").value("Plano de Teste"))
                .andExpect(jsonPath("$.objetivo").value("Melhorar performance da equipe"))
                .andExpect(jsonPath("$.status").value("PENDENTE"));
    }

    @Test
    void testCreatePlano_camposInvalidos() throws Exception {
        PlanoAcaoDTO planoInvalido = new PlanoAcaoDTO();
        planoInvalido.setTitulo("");
        planoInvalido.setObjetivo(null);
        planoInvalido.setData(null);

        mockMvc.perform(post("/api/planos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(planoInvalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testListarPlanos_sucesso() throws Exception {
        List<PlanoAcao> planos = List.of(
                PlanoAcao.builder()
                        .id(1L)
                        .titulo("Plano A")
                        .objetivo("Objetivo A")
                        .data(LocalDate.of(2025, 6, 30))
                        .status(StatusPlano.PENDENTE)
                        .build()
        );

        Mockito.when(planoAcaoService.findAll()).thenReturn(planos);

        mockMvc.perform(get("/api/planos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].titulo").value("Plano A"))
                .andExpect(jsonPath("$[0].objetivo").value("Objetivo A"))
                .andExpect(jsonPath("$[0].status").value("PENDENTE"));
    }

    @Test
    void testDeletarPlano_sucesso() throws Exception {
        Mockito.doNothing().when(planoAcaoService).delete(1L);

        mockMvc.perform(delete("/api/planos/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void testAtualizarStatus_sucesso() throws Exception {
        PlanoAcao planoComStatusAtualizado = PlanoAcao.builder()
                .id(1L)
                .titulo(planoSalvo.getTitulo())
                .objetivo(planoSalvo.getObjetivo())
                .data(planoSalvo.getData())
                .status(StatusPlano.EM_ANDAMENTO)
                .build();

        Mockito.when(planoAcaoService.updateStatus(1L, "EM_ANDAMENTO"))
                .thenReturn(planoComStatusAtualizado);

        mockMvc.perform(patch("/api/planos/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"EM_ANDAMENTO\"}"))
                .andExpect(status().isOk());
    }
}