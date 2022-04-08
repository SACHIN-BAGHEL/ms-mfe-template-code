package com.entando.template.persistence.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;

@Entity
@Data
public class EntTemplate {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false)
	private String templateName;

	@Column(nullable = false, length = 600)
	private String collectionType;

	@Column(nullable = false, length = 600)
	private String contentShape;

	@Column(nullable = false, unique = true)
	private String code;

	@CreationTimestamp
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

	public EntTemplate() {
		super();
	}

	public EntTemplate(com.entando.template.persistence.entity.EntTemplate entity) {
		this.id = entity.getId();
		this.templateName = entity.getTemplateName();
		this.code = entity.getCode();
		this.collectionType = entity.getCollectionType();
		this.contentShape = entity.getContentShape();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		result = prime * result + ((collectionType == null) ? 0 : collectionType.hashCode());
		result = prime * result + ((contentShape == null) ? 0 : contentShape.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((templateName == null) ? 0 : templateName.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		EntTemplate other = (EntTemplate) obj;
		if (code == null) {
			if (other.code != null)
				return false;
		} else if (!code.equals(other.code))
			return false;
		if (collectionType == null) {
			if (other.collectionType != null)
				return false;
		} else if (!collectionType.equals(other.collectionType))
			return false;
		if (contentShape == null) {
			if (other.contentShape != null)
				return false;
		} else if (!contentShape.equals(other.contentShape))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (templateName == null) {
			if (other.templateName != null)
				return false;
		} else if (!templateName.equals(other.templateName))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "EntTemplate [id=" + id + ", templateName=" + templateName + ", collectionType=" + collectionType
				+ ", contentShape=" + contentShape + ", code=" + code + "]";
	}

}
