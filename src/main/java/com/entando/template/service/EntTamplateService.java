package com.entando.template.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

import com.entando.template.persistence.EntTemplateRepository;
import com.entando.template.persistence.entity.EntTemplate;
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
			Integer pageSize, String code) {
		logger.debug("{}: getFilteredTemplates: Get templates in paginated manner", CLASS_NAME);
		Pageable pageable;
		if (pageSize == 0) {
			pageable = Pageable.unpaged();
		} else {
//			paging = PageRequest.of(pageNum, pageSize, Sort.by(new Sort.Order(Sort.Direction.ASC, "bundleGroup.name")).and(Sort.by("lastUpdated").descending()));
			pageable = PageRequest.of(pageNum, pageSize,
					Sort.by(new Sort.Order(Sort.Direction.ASC, "templateName")).and(Sort.by("updatedAt").descending()));
		}
		Page<EntTemplate> page = templateRepository.findAll(pageable);
		PagedContent<TemplateResponseView, EntTemplate> pagedContent = new PagedContent<>(
				toResponseViewList(page), page);
		return pagedContent;
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
		toSave.setCreatedAt(LocalDateTime.now());
		toSave.setUpdatedAt(LocalDateTime.now());
		return templateRepository.save(toSave);
	}

	/**
	 * 
	 * @param templateId
	 */
	public void deleteTemplate(String templateId) {
		templateRepository.deleteById(Long.valueOf(templateId));
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
			viewObj.setCreatedAt(entity.getCreatedAt());
			viewObj.setUpdatedAt(entity.getUpdatedAt());

			list.add(viewObj);
		});
		return list;
	}
}
