import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from '../../api/useAsync';
import { validateProgramForm, showError, showSuccess, validateStartDate, validateEndDate, validateBudgetInput } from '../../api/helpers';
import programService from '../../api/programService';
import { Loader } from '../../components/global/Loader';
import './Forms.css';

export const CreateProgramForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldError, reset } = useForm(
    {
      title: '',
      description: '',
      budget: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'ACTIVE',
    },
    async (formValues) => {
      const validationErrors = validateProgramForm(formValues);
      if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([field, message]) => {
          setFieldError(field, message);
        });
        return;
      }

      setLoading(true);
      try {
        const data = {
          title: formValues.title.trim(),
          description: formValues.description.trim(),
          budget: parseFloat(formValues.budget),
          startDate: formValues.startDate,
          endDate: formValues.endDate,
          status: formValues.status,
        };

        const response = await programService.createProgram(data);
        showSuccess('Program created successfully!');
        reset();
        onSuccess?.(response);
      } catch (error) {
        showError(error.message || 'Failed to create program');
      } finally {
        setLoading(false);
      }
    }
  );

  // Handle budget input with real-time validation
  const handleBudgetChange = (e) => {
    const value = e.target.value;
    handleChange(e);
    
    // Real-time validation
    if (value !== '') {
      const budgetError = validateBudgetInput(value);
      if (budgetError) {
        setFieldError('budget', budgetError);
      } else {
        setFieldError('budget', null);
      }
    }
  };

  // Handle start date with real-time validation
  const handleStartDateChange = (e) => {
    handleChange(e);
    const dateError = validateStartDate(e.target.value);
    if (dateError) {
      setFieldError('startDate', dateError);
    } else {
      setFieldError('startDate', null);
    }
  };

  // Handle end date with real-time validation
  const handleEndDateChange = (e) => {
    handleChange(e);
    const dateError = validateEndDate(e.target.value, values.startDate);
    if (dateError) {
      setFieldError('endDate', dateError);
    } else {
      setFieldError('endDate', null);
    }
  };

  return (
    <motion.form
      className="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Program Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter program title"
          maxLength="100"
          required
          disabled={loading}
        />
        {touched.title && errors.title && (
          <div className="invalid-feedback">{errors.title}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter program description"
          rows="4"
          maxLength="1000"
          required
          disabled={loading}
          style={{ resize: 'vertical', minHeight: '100px' }}
        />
        {touched.description && errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}
        <small className="form-text">
          {values.description.length}/1000 characters
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="budget" className="form-label">
          Budget (₹) <span className="required">*</span>
        </label>
        <input
          type="text"
          id="budget"
          name="budget"
          className={`form-control ${touched.budget && errors.budget ? 'is-invalid' : ''}`}
          value={values.budget}
          onChange={handleBudgetChange}
          onBlur={handleBlur}
          placeholder="Enter budget amount"
          required
          disabled={loading}
        />
        {touched.budget && errors.budget && (
          <div className="invalid-feedback">{errors.budget}</div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate" className="form-label">
            Start Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className={`form-control ${touched.startDate && errors.startDate ? 'is-invalid' : ''}`}
            value={values.startDate}
            onChange={handleStartDateChange}
            onBlur={handleBlur}
            required
            disabled={loading}
          />
          {touched.startDate && errors.startDate && (
            <div className="invalid-feedback">{errors.startDate}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="form-label">
            End Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className={`form-control ${touched.endDate && errors.endDate ? 'is-invalid' : ''}`}
            value={values.endDate}
            onChange={handleEndDateChange}
            onBlur={handleBlur}
            required
            disabled={loading}
          />
          {touched.endDate && errors.endDate && (
            <div className="invalid-feedback">{errors.endDate}</div>
          )}
        </div>
      </div>

      {loading && <Loader message="Creating program..." />}

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Program'}
      </button>
    </motion.form>
  );
};

export default CreateProgramForm;
