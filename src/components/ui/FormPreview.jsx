import React from 'react';
import Form from '@rjsf/core';

function FormPreview({ schema }) {
  if (!schema || !schema.properties) {
    return <p>No form to preview.</p>;
  }

  const { uiSchema = {}, ...jsonSchema } = schema;

  return (
    <div>
      <Form
        schema={jsonSchema}
        uiSchema={uiSchema}
        onSubmit={({ formData }) => console.log('Form submitted:', formData)}
      />
    </div>
  );
}

export default FormPreview;
