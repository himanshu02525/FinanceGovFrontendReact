import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from '../../api/useAsync';
import '../../../src/components/global/ConfirmDialog.css';
import './Forms.css';

export const UpdateProgramDialog = ({
    isOpen,
    program,
    isLoading = false,
    onConfirm,
    onCancel,
}) => {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useForm(
        {
            title: program?.title || '',
            description: program?.description || '',
            budget: program?.budget || '',
            startDate: program?.startDate ? program.startDate.split('T')[0] : '',
            endDate: program?.endDate ? program.endDate.split('T')[0] : '',
            status: program?.status || 'ACTIVE',
        },
        async (formValues) => {

            
            const updatedFields = {};

            if (formValues.title !== program.title) {
                updatedFields.title = formValues.title.trim();
            }

            if (formValues.description !== program.description) {
                updatedFields.description = formValues.description.trim();
            }

            if (parseFloat(formValues.budget) !== program.budget) {
                updatedFields.budget = parseFloat(formValues.budget);
            }

            const originalStart = program.startDate?.split('T')[0];
            if (formValues.startDate !== originalStart) {
                updatedFields.startDate = formValues.startDate;
            }

            const originalEnd = program.endDate?.split('T')[0];
            if (formValues.endDate !== originalEnd) {
                updatedFields.endDate = formValues.endDate;
            }

            if (formValues.status !== program.status) {
                updatedFields.status = formValues.status;
            }

            if (Object.keys(updatedFields).length > 0) {
                await onConfirm(updatedFields);
            } else {
                onCancel();
            }
        }
    );

    // Initialize form when program changes
    useEffect(() => {
        if (program && isOpen) {
            setValues({
                title: program.title || '',
                description: program.description || '',
                budget: program.budget || '',
                startDate: program.startDate ? program.startDate.split('T')[0] : '',
                endDate: program.endDate ? program.endDate.split('T')[0] : '',
                status: program.status || 'ACTIVE',
            });
        }
    }, [program, isOpen, setValues]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('dialog-open');
        } else {
            document.body.classList.remove('dialog-open');
        }
        return () => {
            document.body.classList.remove('dialog-open');
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="confirm-dialog-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />

                    <div className="confirm-dialog-wrapper">
                        <motion.div
                            className="confirm-dialog update-dialog"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="confirm-dialog-header">
                                <h2 className="confirm-dialog-title">Update Program</h2>
                                <button
                                    className="confirm-dialog-close"
                                    onClick={onCancel}
                                    disabled={isLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="update-form">
                                <div className="confirm-dialog-content">
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
                                            disabled={isLoading}
                                        />
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
                                            rows="3"
                                            maxLength="1000"
                                            required
                                            disabled={isLoading}
                                            style={{ resize: 'vertical', minHeight: '80px' }}
                                        />
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
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter budget amount"
                                            required
                                            disabled={isLoading}
                                        />
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
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                disabled={isLoading}
                                            />
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
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status" className="form-label">
                                            Status <span className="required">*</span>
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            className={`form-select ${touched.status && errors.status ? 'is-invalid' : ''}`}
                                            value={values.status}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="confirm-dialog-footer">
                                    <button
                                        type="button"
                                        className="confirm-dialog-btn cancel-btn"
                                        onClick={onCancel}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="confirm-dialog-btn confirm-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="loading-spinner"></span>
                                        ) : (
                                            'Update Program'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UpdateProgramDialog;