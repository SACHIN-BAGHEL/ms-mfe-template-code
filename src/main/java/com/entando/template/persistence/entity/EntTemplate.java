package com.entando.template.persistence.entity;

import java.time.LocalDateTime;
import java.util.Objects;

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

	@Column(nullable = false, length = 50)
	private String templateName;

	@Column(nullable = false, length = 600)
	private String collectionType;

	@Column(columnDefinition="TEXT", nullable = false)
	private String contentShape;

	@Column(nullable = true)
	private String styleSheet;

	@CreationTimestamp
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

	public EntTemplate() {
		super();
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
		return Objects.equals(collectionType, other.collectionType) && Objects.equals(contentShape, other.contentShape)
				&& Objects.equals(createdAt, other.createdAt) && Objects.equals(id, other.id)
				&& Objects.equals(styleSheet, other.styleSheet) && Objects.equals(templateName, other.templateName)
				&& Objects.equals(updatedAt, other.updatedAt);
	}

	@Override
	public int hashCode() {
		return Objects.hash(collectionType, contentShape, createdAt, id, styleSheet, templateName, updatedAt);
	}

	@Override
	public String toString() {
		return "EntTemplate [id=" + id + ", templateName=" + templateName + ", collectionType=" + collectionType
				+ ", contentShape=" + contentShape + ", styleSheet=" + styleSheet + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + "]";
	}
}
