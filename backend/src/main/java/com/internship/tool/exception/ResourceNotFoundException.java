// ResourceNotFoundException.java: Custom exception thrown when a requested resource is not found.
// Produces a 404 response via GlobalExceptionHandler.

package com.internship.tool.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
