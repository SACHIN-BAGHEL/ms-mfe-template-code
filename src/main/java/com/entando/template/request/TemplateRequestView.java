package com.entando.template.request;

import com.entando.template.persistence.entity.EntTemplate;

import lombok.Data;

@Data
public class TemplateRequestView {
	private String templateName;
	private String collectionType;
	private String contentShape;
	private String code;

	public EntTemplate createEntity(TemplateRequestView templateRequestView, Long id) {
		EntTemplate entity = new EntTemplate();
		entity.setId(id);
		entity.setCode(templateRequestView.getCode());
		entity.setCollectionType(templateRequestView.getCollectionType());
		entity.setTemplateName(templateRequestView.getTemplateName());
		entity.setContentShape(templateRequestView.getContentShape());
		return entity;
	}
}
