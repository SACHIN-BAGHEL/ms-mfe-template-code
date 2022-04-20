package com.entando.template.service;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.entando.template.config.ApplicationConstants;
import com.entando.template.exception.DuplicateTemplateCodeException;
import com.entando.template.persistence.EntTemplateRepository;
import com.entando.template.persistence.entity.EntTemplate;
import com.entando.template.request.TemplateRequestView;
import com.entando.template.response.TemplateResponseView;
import com.entando.template.util.PagedContent;

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
	 * Get templates paginated
	 * @param pageNum
	 * @param pageSize
	 * @param code
	 * @return
	 */
	public PagedContent<TemplateResponseView, EntTemplate> getFilteredTemplates(Integer pageNum,
			Integer pageSize, String sanitizedCollectionType) {
		logger.debug("{}: getFilteredTemplates: Get templates in paginated manner", CLASS_NAME);
		Pageable pageable;
		Page<EntTemplate> page = null;

		if (pageSize == 0) {
			pageable = Pageable.unpaged();
		} else {
//			paging = PageRequest.of(pageNum, pageSize, Sort.by(new Sort.Order(Sort.Direction.ASC, "bundleGroup.name")).and(Sort.by("lastUpdated").descending()));
			pageable = PageRequest.of(pageNum, pageSize, Sort.by(new Sort.Order(Sort.Direction.ASC, ApplicationConstants.TEMPLATE_SORT_PARAM_TEMPLATE_NAME))
					.and(Sort.by(ApplicationConstants.TEMPLATE_SORT_PARAM_UPDATAED_AT).descending()));
		}

		//Check if search parameter is 'all/All/ALL'
		if(sanitizedCollectionType.equalsIgnoreCase(ApplicationConstants.TEMPLATE_SEARCH_PARAM_ALL)) {
			page = templateRepository.findAll(pageable);
		} else {
			page = templateRepository.findByCollectionType(sanitizedCollectionType, pageable);
		}

		PagedContent<TemplateResponseView, EntTemplate> pagedContent = new PagedContent<>(toResponseViewList(page), page);
		return pagedContent;
	}

	/**
	 * Get a template by id
	 * @param templateId
	 * @return
	 */
	public Optional<EntTemplate> getTemplate(Long templateId) {
		return templateRepository.findById(templateId);
	}

	/**
	 * 
	 * @param toSave
	 * @return
	 */
	public EntTemplate createTemplate(EntTemplate toSave) throws DuplicateTemplateCodeException {
//		if(templateRepository.existsByCode(toSave.getCode().trim())) {
//			throw new DuplicateTemplateCodeException(ApplicationConstants.TEMPLATE_ALREADY_EXISTS_ERR_MSG);
//		}
		//Temporary code
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss.SSS");
		String string  = dateFormat.format(new Date());
		toSave.setCode(string);

		toSave.setCreatedAt(LocalDateTime.now());
		toSave.setUpdatedAt(LocalDateTime.now());
		return templateRepository.save(toSave);
	}
	
	/**
	 * Update a template
	 * @param toUpdate
	 * @param reqView
	 * @return
	 */
	public EntTemplate updateTemplate(EntTemplate toUpdate, TemplateRequestView reqView) {
//		toUpdate.setCode(reqView.getCode());
		toUpdate.setCollectionType(reqView.getCollectionType());
		toUpdate.setTemplateName(reqView.getTemplateName());
		toUpdate.setContentShape(reqView.getContentShape());
		toUpdate.setStyleSheet(reqView.getStyleSheet());
		toUpdate.setUpdatedAt(LocalDateTime.now());
		return templateRepository.save(toUpdate);
	}

	/**
	 * 
	 * @param templateId
	 */
	public void deleteTemplate(Long templateId) {
		templateRepository.deleteById(templateId);
	}

	/**
	 * Convert to response view list
	 * 
	 * @param page
	 * @return
	 */
	private List<TemplateResponseView> toResponseViewList(Page<EntTemplate> page) {
		logger.debug("{}: toResponseViewList: Convert Bundle Group Version list to response view list", CLASS_NAME);
		List<TemplateResponseView> list = new ArrayList<TemplateResponseView>();
		page.getContent().stream().forEach((entity) -> {
			TemplateResponseView viewObj = new TemplateResponseView();
			viewObj.setId(entity.getId());
			viewObj.setCode(entity.getCode());
			viewObj.setCollectionType(entity.getCollectionType());
			viewObj.setTemplateName(entity.getTemplateName());
			viewObj.setContentShape(entity.getContentShape());
			viewObj.setStyleSheet(entity.getStyleSheet());
			viewObj.setCreatedAt(entity.getCreatedAt());
			viewObj.setUpdatedAt(entity.getUpdatedAt());

			list.add(viewObj);
		});
		return list;
	}
}
