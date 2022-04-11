package com.entando.template.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.entando.template.config.ApplicationConstants;
import com.entando.template.persistence.entity.EntTemplate;

import lombok.Data;

@Data
public class TemplateRequestView {

	@NotEmpty(message = "collectionType is mandatory field")
	private String collectionType;

	@NotEmpty(message = "templateName is mandatory field")
	@Size(min = 1, max = ApplicationConstants.TEMPLATE_NAME_MAX_LENGTH, message = "max char length for templateName: "+ ApplicationConstants.TEMPLATE_NAME_MAX_LENGTH)
	private String templateName;

	private String contentShape;

	@NotEmpty(message = "code is mandatory field")
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
