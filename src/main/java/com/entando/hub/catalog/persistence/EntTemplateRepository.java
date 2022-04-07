package com.entando.hub.catalog.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entando.hub.catalog.persistence.entity.EntTemplate;

public interface EntTemplateRepository extends JpaRepository<EntTemplate, Long> {


}
