package com.vitorcd.planodeacao.controllers;

import com.vitorcd.planodeacao.dto.AcaoDTO;
import com.vitorcd.planodeacao.entity.Acao;
import com.vitorcd.planodeacao.enums.StatusAcao;
import com.vitorcd.planodeacao.service.AcaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AcaoController {

    @Autowired
    private AcaoService acaoService;

    @GetMapping("/planos/{planoId}/acoes")
    public ResponseEntity<List<Acao>> getAcoesByPlano(@PathVariable Long planoId) {
        List<Acao> acoes = acaoService.findByPlanoAcaoId(planoId);
        return ResponseEntity.ok(acoes);
    }

    @GetMapping("/acoes/{id}")
    public ResponseEntity<Acao> getAcaoById(@PathVariable Long id) {
        Acao acao = acaoService.findById(id);
        return ResponseEntity.ok(acao);
    }

    @PostMapping("/planos/{planoId}/acoes")
    public ResponseEntity<Acao> createAcao(@PathVariable Long planoId, @Valid @RequestBody AcaoDTO acaoDTO) {
        Acao acao = acaoService.create(planoId, acaoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(acao);
    }

    @PutMapping("/acoes/{id}")
    public ResponseEntity<Acao> updateAcao(@PathVariable Long id, @Valid @RequestBody AcaoDTO acaoDTO) {
        Acao acao = acaoService.update(id, acaoDTO);
        return  ResponseEntity.ok(acao);
    }

    @PatchMapping("/acoes/{id}/status")
    public ResponseEntity<Acao> updateAcaoStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String statusStr = statusUpdate.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }

        StatusAcao status;
        try {
            status = StatusAcao.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
        }

        Acao acao = acaoService.updateStatus(id, status);
        return ResponseEntity.ok(acao);
    }

    @DeleteMapping("/acoes/{id}")
    public ResponseEntity<Void> deleteAcao(@PathVariable Long id) {
        acaoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("acoes/status/{status}")
    public ResponseEntity<List<Acao>> getAcoesByStatus(@PathVariable StatusAcao status) {
        List<Acao> acoes = acaoService.findByStatus(status);
        return ResponseEntity.ok(acoes);
    }
}
