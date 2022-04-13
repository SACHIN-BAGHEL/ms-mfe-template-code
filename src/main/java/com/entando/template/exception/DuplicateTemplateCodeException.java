package com.entando.template.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateTemplateCodeException extends RuntimeException {

	private static final long serialVersionUID = 5403913975958019777L;

	public DuplicateTemplateCodeException() {
		super();
	}

	public DuplicateTemplateCodeException(final String message) {
		super(message);
	}
}
