package com.entando.hub.catalog.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entando.hub.catalog.persistence.EntTemplateRepository;
import com.entando.hub.catalog.persistence.entity.EntTemplate;

@Service
public class EntTamplateService {

	private final Logger logger = LoggerFactory.getLogger(EntTamplateService.class);
	private final String CLASS_NAME = this.getClass().getSimpleName();

	@Autowired
	private EntTemplateRepository templateRepository;
	
	
	/**
	 * 
	 * @return
	 */
	public List<EntTemplate> getTemplates() {
		return templateRepository.findAll();
	}
	
	/**
	 * 
	 * @param templateId
	 * @return
	 */
	public Optional<EntTemplate> getTemplate(String templateId) {
		return templateRepository.findById(Long.parseLong(templateId));
	}
	
	/**
	 * 
	 * @param toSave
	 * @return
	 */
	public EntTemplate createTemplate(EntTemplate toSave) {
		return templateRepository.save(toSave);
	}
	
	/**
	 * 
	 * @param templateId
	 */
	public void deleteTemplate(String templateId) {
		templateRepository.deleteById(Long.valueOf(templateId));
	}

}
