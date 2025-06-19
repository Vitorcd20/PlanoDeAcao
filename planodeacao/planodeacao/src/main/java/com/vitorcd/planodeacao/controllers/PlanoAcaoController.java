package com.vitorcd.planodeacao.controllers;

import com.vitorcd.planodeacao.dto.PlanoAcaoDTO;
import com.vitorcd.planodeacao.entity.PlanoAcao;
import com.vitorcd.planodeacao.enums.StatusPlano;
import com.vitorcd.planodeacao.service.PlanoAcaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/planos")
@CrossOrigin(origins = "*")
public class PlanoAcaoController {

    @Autowired
    private PlanoAcaoService planoAcaoService;


    @GetMapping
    public ResponseEntity<List<PlanoAcao>> getAllPlanos() {
        List<PlanoAcao> planos = planoAcaoService.findAll();
        return ResponseEntity.ok(planos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoAcao> getPlanoById(@PathVariable Long id) {
        PlanoAcao plano = planoAcaoService.findById(id);
        return ResponseEntity.ok(plano);
    }

    @PostMapping
    public ResponseEntity<PlanoAcao> createPlano(@Valid @RequestBody PlanoAcaoDTO planoDTO) {
        PlanoAcao plano = planoAcaoService.create(planoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(plano);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoAcao> updatePlano(@PathVariable Long id, @Valid @RequestBody PlanoAcaoDTO planoDTO) {
        PlanoAcao plano = planoAcaoService.update(id, planoDTO);
        return ResponseEntity.ok(plano);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PlanoAcao> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String novoStatus = statusUpdate.get("status");
        if (novoStatus == null) {
            return ResponseEntity.badRequest().build();
        }

        PlanoAcao plano = planoAcaoService.updateStatus(id, novoStatus);
        return ResponseEntity.ok(plano);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlano(@PathVariable Long id) {
        planoAcaoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PlanoAcao>> getPlanosByStatus(@PathVariable StatusPlano status) {
        List<PlanoAcao> planos = planoAcaoService.findByStatus(status);
        return ResponseEntity.ok(planos);
    }



}
