package com.entando.template.rest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.security.RolesAllowed;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entando.template.config.ApplicationConstants;
import com.entando.template.request.TemplateRequestView;
import com.entando.template.response.TemplateResponseView;
import com.entando.template.service.EntTamplateService;
import com.entando.template.util.PagedContent;

import io.swagger.v3.oas.annotations.Operation;

/**
 * Controller class to perform CRUD for template
 * 
 * @author akhilesh
 *
 */

@RestController
@RequestMapping("/api/template")
public class EntTemplateController {

	private final Logger logger = LoggerFactory.getLogger(EntTemplateController.class);

	@Autowired
	private EntTamplateService entTamplateService;

	@Operation(summary = "Get all the templates", description = "Public api, no authentication required.")
	@GetMapping("/")
	@RolesAllowed({ ApplicationConstants.ADMIN })
	public List<TemplateResponseView> getTemplates() {
		logger.debug("REST request to get templates");
		return entTamplateService.getTemplates().stream().map(TemplateResponseView::new).collect(Collectors.toList());
	}

	@Operation(summary = "Get all the templates", description = "Public api, no authentication required.")
	@GetMapping("/paged")
	@RolesAllowed({ ApplicationConstants.ADMIN })
	public PagedContent<TemplateResponseView, com.entando.template.persistence.entity.EntTemplate> getFilteredTemplates(
			@RequestParam Integer page, @RequestParam Integer pageSize, @RequestParam(required = false) String collectionType) {
		logger.debug("REST request to get paginated templates");
		Integer sanitizedPageNum = page >= 1 ? page - 1 : 0;
		String sanitizedCollectionType = StringUtils.isEmpty(collectionType) ? ApplicationConstants.TEMPLATE_SEARCH_PARAM_ALL : collectionType.trim();

		PagedContent<TemplateResponseView, com.entando.template.persistence.entity.EntTemplate> pagedContent = entTamplateService
				.getFilteredTemplates(sanitizedPageNum, pageSize, sanitizedCollectionType);
		return pagedContent;
	}

	@Operation(summary = "Get the template details by id", description = "Public api, no authentication required.")
	@GetMapping("/{templateId}")
	@RolesAllowed({ ApplicationConstants.ADMIN })
	public ResponseEntity<TemplateResponseView> getTemplate(@PathVariable Long templateId) {
		logger.debug("REST request to get EntTemplate Id: {}", templateId);
		Optional<com.entando.template.persistence.entity.EntTemplate> entTemplateOptional = entTamplateService.getTemplate(templateId);
		if (entTemplateOptional.isPresent()) {
			return new ResponseEntity<>(entTemplateOptional.map(TemplateResponseView::new).get(), HttpStatus.OK);
		} else {
			logger.warn("Requested template '{}' does not exists", templateId);
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}

	@Operation(summary = "Create a new template", description = "Public api, no authentication required.")
	@PostMapping("/")
	@RolesAllowed({ ApplicationConstants.ADMIN })
	public ResponseEntity<TemplateResponseView> createEntTemplate(@RequestBody TemplateRequestView entTemplateReqView) {
		logger.debug("REST request to create EntTemplate: {}", entTemplateReqView);
		com.entando.template.persistence.entity.EntTemplate entity = entTamplateService.createTemplate(entTemplateReqView.createEntity(entTemplateReqView, null));
		return new ResponseEntity<>(new TemplateResponseView(entity), HttpStatus.CREATED);
	}

	@Operation(summary = "Update a template", description = "Public api, no authentication required.")
	@PutMapping("/{templateId}")
	@RolesAllowed({ ApplicationConstants.ADMIN })
	public ResponseEntity<TemplateResponseView> updateEntTemplate(@RequestBody TemplateRequestView reqView, @PathVariable Long templateId) {
		logger.debug("REST request to update EntTemplate {}: {}", templateId);
		Optional<com.entando.template.persistence.entity.EntTemplate> templateOptional = entTamplateService.getTemplate(templateId);
		if (!templateOptional.isPresent()) {
			logger.warn("Template '{}' does not exists", templateId);
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		} else {
			com.entando.template.persistence.entity.EntTemplate updatedEntity = entTamplateService.updateTemplate(templateOptional.get(), reqView);
			return new ResponseEntity<>(new TemplateResponseView(updatedEntity), HttpStatus.OK);
		}
	}

	@Operation(summary = "Delete a template", description = "Public api, no authentication required.")
	@DeleteMapping("/{templateId}")
	@RolesAllowed({ ApplicationConstants.ADMIN })
	public ResponseEntity<String> deleteEntTemplate(@PathVariable Long templateId) {
		logger.debug("REST request to delete template {}", templateId);
		Optional<com.entando.template.persistence.entity.EntTemplate> entTemplateOptional = entTamplateService.getTemplate(templateId);
		if (!entTemplateOptional.isPresent()) {
			logger.warn("Requested template '{}' does not exists", templateId);
			return new ResponseEntity<>(ApplicationConstants.TEMPLATE_DOES_NOT_EXIST_MSG, HttpStatus.NOT_FOUND);
		}
		entTamplateService.deleteTemplate(templateId);
		return new ResponseEntity<>(ApplicationConstants.TEMPLATE_DELETED, HttpStatus.OK);
	}
}
