package com.entando.template.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entando.template.persistence.entity.EntTemplate;

public interface EntTemplateRepository extends JpaRepository<EntTemplate, Long> {


}
