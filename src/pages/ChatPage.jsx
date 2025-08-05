import React, { useState } from "react";
import "./ChatPage.css";
import { generateSchema } from "../services/apiService";
import GoogleLoginButton from "../components/ui/GoogleLoginButton";

// Calls Google Forms API to create the form (only sets title)
async function createGoogleForm(payload, accessToken) {
  const res = await fetch("https://forms.googleapis.com/v1/forms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      info: {
        title: payload.info.title,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Failed to create Google Form");
  }

  return await res.json(); // returns formId
}

// Calls Google Forms API batchUpdate to add items (questions)
async function updateGoogleFormItems(formId, items, accessToken) {
  const requests = items.map((item) => ({
    createItem: {
      item: item,
      location: {
        index: 0,
      },
    },
  }));

  const res = await fetch(
    `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error?.message || "Failed to update Google Form items"
    );
  }

  return await res.json();
}

// Helper function to clear all items from a Google Form
async function clearGoogleFormItems(formId, accessToken) {
  // First, get the current form structure
  const getRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!getRes.ok) {
    console.warn("Could not fetch form structure for clearing");
    return;
  }

  const form = await getRes.json();
  const existingItems = form.items || [];

  if (existingItems.length === 0) return;

  // Create delete requests for all existing items
  const requests = existingItems.map((item) => ({
    deleteItem: {
      location: {
        index: 0, // Always delete from index 0 since indices shift
      },
    },
  }));

  const res = await fetch(
    `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.warn("Failed to clear form items:", error.error?.message);
  }
}

// Helper function to update Google Form title
async function updateGoogleFormTitle(formId, newTitle, accessToken) {
  const res = await fetch(
    `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            updateFormInfo: {
              info: {
                title: newTitle,
              },
              updateMask: "title",
            },
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.warn("Failed to update form title:", error.error?.message);
  }
}

// Calls Google Slides API to create the presentation (only sets title)
async function createGoogleSlides(payload, accessToken) {
  const res = await fetch("https://slides.googleapis.com/v1/presentations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Failed to create Google Slides");
  }

  return await res.json(); // returns presentationId
}

// Helper function to get presentation and find text elements
async function getGoogleSlidesStructure(presentationId, accessToken) {
  const res = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Failed to get presentation structure");
  }

  return await res.json();
}

// *** THIS IS THE CORRECTED AND OPTIMIZED FUNCTION ***
// Calls Google Slides API batchUpdate to add all slides and content in one call
async function updateGoogleSlidesItems(presentationId, slides, accessToken, isEditMode = false) {
  if (!slides || slides.length === 0) return;

  // Get the presentation to find the ID of the default first slide
  const presentation = await getGoogleSlidesStructure(presentationId, accessToken);
  const existingSlides = presentation.slides || [];

  const requests = [];

  // 1. Only delete the default blank slide if we're NOT in edit mode and there's a default slide
  if (!isEditMode && existingSlides.length > 0) {
    const defaultSlideId = existingSlides[0]?.objectId;
    if (defaultSlideId) {
      requests.push({
        deleteObject: {
          objectId: defaultSlideId,
        },
      });
    }
  }

  // 2. Loop through the slides data and build all requests in the correct order.
  slides.forEach((slide, i) => {
    const slideId = `slide_${i + 1}`; // e.g., slide_1, slide_2

    // Request to create the new slide
    requests.push({
      createSlide: {
        objectId: slideId,
        insertionIndex: i, // Add slides in order
        slideLayoutReference: {
          predefinedLayout: slide.layout || "TITLE_AND_BODY",
        },
      },
    });

    // Requests for the title
    if (slide.title) {
      const titleId = `${slideId}_title`;
      requests.push({
        createShape: {
          objectId: titleId,
          shapeType: "TEXT_BOX",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              height: { magnitude: 50, unit: "PT" },
              width: { magnitude: 600, unit: "PT" },
            },
            transform: {
              scaleX: 1, scaleY: 1, translateX: 50, translateY: 50, unit: "PT",
            },
          },
        },
      });
      requests.push({
        insertText: { objectId: titleId, text: slide.title, insertionIndex: 0 },
      });
      requests.push({
        updateTextStyle: {
          objectId: titleId,
          style: {
            bold: true,
            fontSize: { magnitude: 24, unit: "PT" },
          },
          fields: "bold,fontSize",
        },
      });
    }

    // Requests for the subtitle
    if (slide.subtitle) {
      const subtitleId = `${slideId}_subtitle`;
      requests.push({
        createShape: {
          objectId: subtitleId,
          shapeType: "TEXT_BOX",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              height: { magnitude: 30, unit: "PT" },
              width: { magnitude: 600, unit: "PT" },
            },
            transform: {
              scaleX: 1, scaleY: 1, translateX: 50, translateY: 120, unit: "PT",
            },
          },
        },
      });
      requests.push({
        insertText: { objectId: subtitleId, text: slide.subtitle, insertionIndex: 0 },
      });
      requests.push({
        updateTextStyle: {
          objectId: subtitleId,
          style: { fontSize: { magnitude: 18, unit: "PT" }, italic: true },
          fields: "fontSize,italic",
        },
      });
    }

    // Requests for the main content
    if (slide.content && Array.isArray(slide.content) && slide.content.length > 0) {
      const contentId = `${slideId}_content`;
      const contentText = slide.content.map(item => `• ${item}`).join('\n');
      requests.push({
        createShape: {
          objectId: contentId,
          shapeType: "TEXT_BOX",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              height: { magnitude: 300, unit: "PT" },
              width: { magnitude: 600, unit: "PT" },
            },
            transform: {
              scaleX: 1, scaleY: 1, translateX: 50, translateY: slide.subtitle ? 170 : 120, unit: "PT",
            },
          },
        },
      });
      requests.push({
        insertText: { objectId: contentId, text: contentText, insertionIndex: 0 },
      });
      requests.push({
        updateTextStyle: {
          objectId: contentId,
          style: { fontSize: { magnitude: 14, unit: "PT" } },
          fields: "fontSize",
        },
      });
    }
    console.log(`✅ Queued up requests for slide ${i + 1}: ${slide.title}`);
  });

  // 3. Execute all requests in a single API call
  if (requests.length > 0) {
    const res = await fetch(
      `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error(`❌ Failed to update slides:`, error.error?.message);
      throw new Error(error.error?.message || "Failed to update Google Slides");
    }
  }

  console.log("✅ All slides created successfully in one batch!");
  return { success: true };
}

// Helper function to clear all slides from a Google Presentation (except the first slide which we'll recreate)
async function clearGoogleSlidesItems(presentationId, accessToken) {
  try {
    // Get the presentation to find all slide IDs
    const presentation = await getGoogleSlidesStructure(presentationId, accessToken);
    const slides = presentation.slides || [];

    if (slides.length === 0) return;

    const requests = [];

    // Delete all slides
    slides.forEach((slide) => {
      requests.push({
        deleteObject: {
          objectId: slide.objectId,
        },
      });
    });

    if (requests.length > 0) {
      const res = await fetch(
        `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requests }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.warn("Failed to clear slides:", error.error?.message);
      }
    }
  } catch (error) {
    console.warn("Error clearing slides:", error.message);
  }
}

// Helper function to update Google Slides title
async function updateGoogleSlidesTitle(presentationId, newTitle, accessToken) {
  const res = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            updatePresentationProperties: {
              properties: {
                title: newTitle,
              },
              fields: "title",
            },
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.warn("Failed to update presentation title:", error.error?.message);
  }
}

// Converts JSON schema to Google Forms API format
function convertSchemaToGoogleForm(schema) {
  const items = [];

  for (const [key, field] of Object.entries(schema.properties)) {
    const required = (schema.required || []).includes(key);
    const title = field.title || key;

    if (field.enum) {
      const choiceType = field.type === "array" ? "CHECKBOX" : "DROP_DOWN";
      const options = field.enum.map((val) => ({ value: val }));
      items.push({
        title,
        questionItem: {
          question: {
            required,
            choiceQuestion: {
              type: choiceType,
              options,
              shuffle: false,
            },
          },
        },
      });
    } else if (field.type === "string" && field.format === "date") {
      items.push({
        title,
        questionItem: {
          question: {
            required,
            dateQuestion: {},
          },
        },
      });
    } else if (field.type === "object" && field.properties) {
      for (const [subKey, subField] of Object.entries(field.properties)) {
        const subTitle = subField.title || subKey;
        items.push({
          title: `${title} - ${subTitle}`,
          questionItem: {
            question: {
              required: false,
              textQuestion: {},
            },
          },
        });
      }
    } else {
      items.push({
        title,
        questionItem: {
          question: {
            required,
            textQuestion: {},
          },
        },
      });
    }
  }

  return {
    info: {
      title: schema.title || "Generated Form",
    },
    items,
  };
}

// Converts JSON schema to Google Slides API format
function convertSchemaToGoogleSlides(schema) {
  // Valid Google Slides predefined layouts
  const getValidLayout = (layout) => {
    const validLayouts = {
      'BLANK': 'BLANK',
      'CAPTION_ONLY': 'CAPTION_ONLY',
      'TITLE': 'TITLE',
      'TITLE_AND_BODY': 'TITLE_AND_BODY',
      'TITLE_AND_TWO_COLUMNS': 'TITLE_AND_TWO_COLUMNS',
      'TITLE_ONLY': 'TITLE_ONLY',
      'SECTION_HEADER': 'SECTION_HEADER',
      'SECTION_TITLE_AND_DESCRIPTION': 'SECTION_TITLE_AND_DESCRIPTION',
      'ONE_COLUMN_TEXT': 'ONE_COLUMN_TEXT',
      'MAIN_POINT': 'MAIN_POINT',
      'BIG_NUMBER': 'BIG_NUMBER'
    };

    // Map common layout names to valid ones
    const layoutMapping = {
      'title-slide': 'TITLE',
      'bullet-points': 'TITLE_AND_BODY',
      'title-and-body': 'TITLE_AND_BODY',
      'title-only': 'TITLE_ONLY',
      'blank': 'BLANK'
    };

    const mappedLayout = layoutMapping[layout?.toLowerCase()] || layout;
    return validLayouts[mappedLayout] || 'TITLE_AND_BODY';
  };

  if (!schema.slides || !Array.isArray(schema.slides)) {
    // Enhanced fallback: create slides based on schema content
    const title = schema.title || "Generated Presentation";
    const fallbackSlides = [
      {
        title: title,
        subtitle: "AI Generated Presentation",
        layout: "TITLE",
      },
      {
        title: "Overview",
        content: [
          "This presentation was generated from your request",
          "Content has been structured automatically",
          "You can edit this presentation directly in Google Slides",
          "Each slide follows best practices for presentation design"
        ],
        layout: "TITLE_AND_BODY",
      }
    ];

    return {
      title: title,
      slides: fallbackSlides,
    };
  }

  return {
    title: schema.title || "Generated Presentation",
    slides: schema.slides.map((slide) => ({
      title: slide.title || "Slide Title",
      subtitle: slide.subtitle || null,
      content: slide.content || [],
      layout: getValidLayout(slide.layout),
    })),
  };
}

// Calls Google Sheets API to create the spreadsheet
async function createGoogleSheets(payload, accessToken) {
  const res = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: payload.title,
      },
      sheets: payload.sheets.map((sheet) => ({
        properties: {
          title: sheet.name,
        },
      })),
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Failed to create Google Sheets");
  }

  return await res.json(); // returns spreadsheetId
}

// Calls Google Sheets API to populate data
async function updateGoogleSheetsData(spreadsheetId, sheetsData, accessToken) {
  // First, get the spreadsheet to retrieve actual sheet IDs
  const getRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!getRes.ok) {
    const error = await getRes.json();
    throw new Error(error.error?.message || "Failed to get spreadsheet info");
  }

  const spreadsheetInfo = await getRes.json();
  const actualSheetIds = spreadsheetInfo.sheets.map(sheet => sheet.properties.sheetId);

  console.log('📊 Retrieved sheet IDs:', actualSheetIds);

  const requests = [];

  sheetsData.forEach((sheet, sheetIndex) => {
    const sheetId = actualSheetIds[sheetIndex];

    if (!sheetId && sheetId !== 0) {
      console.warn(`⚠️  No sheet ID found for index ${sheetIndex}`);
      return;
    }

    if (sheet.headers && sheet.headers.length > 0) {
      // Add headers
      requests.push({
        updateCells: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: sheet.headers.length,
          },
          rows: [
            {
              values: sheet.headers.map((header) => ({
                userEnteredValue: {
                  stringValue: header,
                },
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                  },
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9,
                  },
                },
              })),
            },
          ],
          fields: "userEnteredValue,userEnteredFormat",
        },
      });
    }

    // Add data rows
    if (sheet.rows && sheet.rows.length > 0) {
      requests.push({
        updateCells: {
          range: {
            sheetId: sheetId,
            startRowIndex: 1,
            endRowIndex: sheet.rows.length + 1,
            startColumnIndex: 0,
            endColumnIndex: sheet.headers ? sheet.headers.length : sheet.rows[0].length,
          },
          rows: sheet.rows.map((row) => ({
            values: row.map((cell) => ({
              userEnteredValue: {
                stringValue: String(cell || ""),
              },
            })),
          })),
          fields: "userEnteredValue",
        },
      });
    }

    // Apply column formatting if specified
    if (sheet.formatting && sheet.formatting.columnWidths) {
      sheet.formatting.columnWidths.forEach((width, colIndex) => {
        requests.push({
          updateDimensionProperties: {
            range: {
              sheetId: sheetId,
              dimension: "COLUMNS",
              startIndex: colIndex,
              endIndex: colIndex + 1,
            },
            properties: {
              pixelSize: width,
            },
            fields: "pixelSize",
          },
        });
      });
    }
  });

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Failed to update Google Sheets data");
  }

  return await res.json();
}

// Helper function to clear all data from Google Sheets
async function clearGoogleSheetsData(spreadsheetId, accessToken) {
  // Get the spreadsheet to retrieve sheet information
  const getRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!getRes.ok) {
    console.warn("Could not fetch spreadsheet structure for clearing");
    return;
  }

  const spreadsheetInfo = await getRes.json();
  const sheets = spreadsheetInfo.sheets || [];

  const requests = [];

  // Clear all content from each sheet
  sheets.forEach((sheet) => {
    const sheetId = sheet.properties.sheetId;
    
    // Clear all cells in the sheet
    requests.push({
      updateCells: {
        range: {
          sheetId: sheetId,
        },
        fields: "userEnteredValue",
      },
    });
  });

  if (requests.length > 0) {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.warn("Failed to clear sheets data:", error.error?.message);
    }
  }
}

// Helper function to update Google Sheets title
async function updateGoogleSheetsTitle(spreadsheetId, newTitle, accessToken) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                title: newTitle,
              },
              fields: "title",
            },
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.warn("Failed to update spreadsheet title:", error.error?.message);
  }
}

// Converts JSON schema to Google Sheets API format
function convertSchemaToGoogleSheets(schema) {
  if (!schema.sheets || !Array.isArray(schema.sheets)) {
    // Enhanced fallback: create a spreadsheet from schema properties if sheets don't exist
    const title = schema.title || "Generated Spreadsheet";
    const fallbackSheets = [
      {
        name: "Sheet1",
        headers: ["Item", "Description", "Status"],
        rows: [
          ["Sample Item 1", "This is a sample entry", "Active"],
          ["Sample Item 2", "Another sample entry", "Pending"],
          ["Sample Item 3", "Third sample entry", "Completed"],
        ],
        formatting: {
          headerStyle: "bold",
          columnWidths: [150, 300, 100],
        },
      },
    ];

    return {
      title: title,
      sheets: fallbackSheets,
    };
  }

  return {
    title: schema.title || "Generated Spreadsheet",
    sheets: schema.sheets.map((sheet) => ({
      name: sheet.name || "Sheet1",
      headers: sheet.headers || [],
      rows: sheet.rows || [],
      formatting: sheet.formatting || {},
    })),
  };
}

// Sidebar Component
const Sidebar = ({ isOpen, onToggle, selectedType, onTypeChange, onNewChat }) => {
  // Placeholder chat history data
  const chatHistory = [
    { id: 1, title: "Untitled Form", type: "form", timestamp: "2024-01-15" },
    { id: 2, title: "Form v2", type: "form", timestamp: "2024-01-14" },
    { id: 3, title: "Sales Presentation", type: "ppt", timestamp: "2024-01-13" },
    { id: 4, title: "Budget Spreadsheet", type: "spreadsheet", timestamp: "2024-01-12" },
    { id: 5, title: "Contact Form", type: "form", timestamp: "2024-01-11" },
    { id: 6, title: "Q4 Report", type: "ppt", timestamp: "2024-01-10" },
    { id: 7, title: "Inventory Tracker", type: "spreadsheet", timestamp: "2024-01-09" },
    { id: 8, title: "Registration Form", type: "form", timestamp: "2024-01-08" },
  ];

  const typeOptions = [
    { id: 'form', label: 'Forms', icon: '📋' },
    { id: 'ppt', label: 'Presentations', icon: '📊' },
    { id: 'spreadsheet', label: 'Spreadsheets', icon: '📈' }
  ];

  return (
    <>
      {/* Sidebar Navigation */}
      <div
        className={`
          fixed top-0 left-0 z-40 w-64 h-full 
          bg-gray-800/95 backdrop-blur-md 
          border-r border-gray-700/50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Top Section: New Chat & Type Selection */}
          <div className="p-4 border-b border-gray-700/50">
            <button 
              onClick={onNewChat}
              className="w-full mb-4 p-3 bg-purple-600 rounded-lg font-semibold text-white transition-all duration-300 ease-out relative group overflow-hidden transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                <span>➕</span>
                <span>New Chat</span>
              </span>
            </button>
            <div className="flex flex-col space-y-2">
              {typeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onTypeChange(option.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-all duration-300 ease-out relative group overflow-hidden transform hover:scale-[1.02] ${selectedType === option.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70 hover:shadow-lg hover:shadow-purple-500/20'
                    }`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="relative text-lg">{option.icon}</span>
                  <span className="relative">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section: Chat History (Scrollable) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-300">Chat History</h3>
            </div>
            <div className="flex-1 px-2 pb-4 overflow-y-auto">
              <div className="space-y-2">
                {chatHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.02] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm">
                          {item.type === 'form' ? '📋' : item.type === 'ppt' ? '📊' : '📈'}
                        </span>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile (closes sidebar on click) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        ></div>
      )}
    </>
  );
};

// ChatConversation Component
const ChatConversation = ({ messages, currentSchema, selectedType }) => {
  return (
    <div className="flex-1 p-2 md:p-6 overflow-auto m-4 md:m-10">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Edit Mode Indicator - Shows above messages when in edit mode */}
        {messages.length > 0 && currentSchema !== null && (
          <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg backdrop-blur-sm mb-4 animate-fade-in-up">
            <div className="flex items-center gap-3 text-blue-300">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                <span className="text-lg">✏️</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Edit Mode Active</div>
                <div className="text-xs text-blue-400">Make changes to your {selectedType} below</div>
              </div>
            </div>
          </div>
        )}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-400 animate-fade-in-up">
            <div className="text-6xl mb-4 animate-bounce-slow">💬</div>
            <p className="text-xl mb-2">Start a conversation!</p>
            <p className="text-sm">
              Describe what kind of form, presentation, or spreadsheet you need
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg backdrop-blur-sm animate-fade-in-side transform transition-all duration-300 hover:scale-[1.02] ${message.type === "user"
                ? "bg-purple-600/90 ml-auto max-w-md shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                : message.isError
                  ? "bg-red-800/90 mr-auto max-w-md border border-red-700/50 shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                  : "bg-gray-800/90 mr-auto max-w-md border border-gray-700/50 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
              }`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: "backwards",
            }}
          >
            <div className="relative">
              {message.type === "user" ? (
                <div className="absolute -right-2 -top-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm animate-fade-in">
                  👤
                </div>
              ) : (
                <div
                  className={`absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-sm animate-fade-in ${message.isError ? "bg-red-700" : "bg-gray-700"
                    }`}
                >
                  {message.isError ? "❌" : "🤖"}
                </div>
              )}
              {/* The fix is in the line below */}
              <div className="mt-1 pl-8"> {/* <-- FIX: Added pl-8 for spacing */}
                {message.content}
                {message.timestamp && (
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ChatInputBox Component
const ChatInputBox = ({ chatInput, setChatInput, handleSubmit, isLoading, selectedType, isEditing }) => {
  const getPlaceholder = () => {
    if (isEditing) {
      // Editing mode placeholders
      switch (selectedType) {
        case 'form':
          return 'Edit the form (e.g., "Change the title to..." or "Add a new field for...")';
        case 'ppt':
          return 'Edit the presentation (e.g., "Change slide 2 title" or "Add a new slide about...")';
        case 'spreadsheet':
          return 'Edit the spreadsheet (e.g., "Change the title" or "Add a new column for...")';
        default:
          return 'Edit your document...';
      }
    } else {
      // Creation mode placeholders
      switch (selectedType) {
        case 'form':
          return 'Describe the form you want to create...';
        case 'ppt':
          return 'Describe the presentation you want to create...';
        case 'spreadsheet':
          return 'Describe the spreadsheet you want to create...';
        default:
          return 'Type your request here...';
      }
    }
  };

  return (
    <div className="p-2 md:p-6 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto flex items-center relative"
      >
        <div className="relative w-full">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full p-4 pr-12 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all duration-200"
            aria-label="Send"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5m0 0l-6 6m6-6l6 6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

// PreviewPanel Component that shows iframe of Google Form or Slides
const PreviewPanel = ({ schema, isLoading, selectedType }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to get the public link based on document type
  const getPublicLink = () => {
    if (schema?.googleFormId) {
      return `https://docs.google.com/forms/d/${schema.googleFormId}/viewform`;
    } else if (schema?.googleSlidesId) {
      return `https://docs.google.com/presentation/d/${schema.googleSlidesId}/edit#slide=id.p`;
    } else if (schema?.googleSheetsId) {
      return `https://docs.google.com/spreadsheets/d/${schema.googleSheetsId}/edit#gid=0`;
    }
    return null;
  };

  // Function to handle export (copy link to clipboard)
  const handleExport = async () => {
    const link = getPublicLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="w-full h-full bg-gray-800/50 backdrop-blur-md p-2 md:p-6 border-l border-gray-700/50 transition-all duration-300 ease-in-out">
      <div className="relative flex justify-center items-center mb-6">
        <h2 className="text-2xl font-bold text-center">
          {selectedType === 'form' ? 'Form Preview' : selectedType === 'ppt' ? 'Presentation Preview' : selectedType === 'spreadsheet' ? 'Spreadsheet Preview' : 'Preview'}
        </h2>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
          {/* <button
            className="px-4 py-2 bg-gray-700/50 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform hover:bg-gray-700/70"
            disabled={!schema}
            onClick={() => {
              const link = getPublicLink();
              if (link) window.open(link, '_blank');
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">Edit</span>
            </span>
          </button> */}
          <button
            className="px-4 py-2 bg-purple-600 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!schema}
            onClick={handleExport}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                {copySuccess ? '✓ Copied!' : 'Share'}
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="bg-gray-900/70 h-[40vh] md:h-[80vh] rounded-lg p-4 border border-gray-700 shadow-xl backdrop-blur-sm overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Generating {selectedType}...</p>
            </div>
          </div>
        ) : schema?.googleFormId ? (
          <iframe
            src={`https://docs.google.com/forms/d/${schema.googleFormId}/viewform?embedded=true`}
            width="100%"
            height="100%"
            className="rounded-lg border-none"
            title="Google Form Preview"
          />
        ) : schema?.googleSlidesId ? (
          <iframe
            src={`https://docs.google.com/presentation/d/${schema.googleSlidesId}/embed?start=false&loop=false&delayms=3000`}
            width="100%"
            height="100%"
            className="rounded-lg border-none"
            title="Google Slides Preview"
            allowFullScreen
          />
        ) : schema?.googleSheetsId ? (
          <iframe
            src={`https://docs.google.com/spreadsheets/d/${schema.googleSheetsId}/edit?usp=sharing&widget=true&headers=false`}
            width="100%"
            height="100%"
            className="rounded-lg border-none"
            title="Google Sheets Preview"
          />
        ) : (
          <div className="text-gray-400 text-center mt-20">
            <div className="text-6xl mb-4">
              {selectedType === 'form' ? '📋' : selectedType === 'ppt' ? '📊' : '📈'}
            </div>
            <p className="text-xl mb-2">Generated {selectedType === 'form' ? 'form' : selectedType === 'ppt' ? 'presentation' : 'spreadsheet'} will appear here</p>
            <p className="text-sm">
              Start by describing the {selectedType} you want to create
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [schema, setSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedType, setSelectedType] = useState('form');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentSchema, setCurrentSchema] = useState(null); // Store the current raw schema for context

  const handleLogin = (token) => {
    setAccessToken(token);
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser({ email: data.email, picture: data.picture }))
      .catch(() => setUser(null));
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setSchema(null);
    setMessages([]);
    setConversationHistory([]);
    setCurrentSchema(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // --- ADDED FUNCTION ---
  // This function now handles changing the tool type.
  // It resets the preview and chat to provide a clean state for the new tool.
  const handleTypeChange = (newType) => {
    // Only run if the type is actually changing to avoid unnecessary resets
    if (newType !== selectedType) {
        setSelectedType(newType);
        setSchema(null);      // <-- THE MAIN FIX: Reset the preview content
        setMessages([]);      // Optional but recommended: Clear the chat history
        setChatInput("");     // Optional but recommended: Clear the input field
        setConversationHistory([]); // Clear conversation history
        setCurrentSchema(null); // Clear current schema
    }
  };

  // Function to start a new chat - resets all context
  const handleNewChat = () => {
    setMessages([]);
    setChatInput("");
    setConversationHistory([]);
    setCurrentSchema(null);
    setSchema(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage = { type: "user", content: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    
    // Add to conversation history for context
    const newConversationEntry = { 
      role: "user", 
      content: chatInput,
      timestamp: new Date().toISOString()
    };
    setConversationHistory(prev => [...prev, newConversationEntry]);

    setIsLoading(true);
    setError(null);

    try {
      // Prepare context for the LLM
      const contextData = {
        conversationHistory: [...conversationHistory, newConversationEntry],
        currentSchema: currentSchema,
        isEditing: messages.length > 0 && currentSchema !== null, // Check if we're in edit mode
        selectedType: selectedType
      };

      console.log('🔄 Sending context to LLM:', {
        isEditing: contextData.isEditing,
        historyLength: contextData.conversationHistory.length,
        hasCurrentSchema: !!contextData.currentSchema
      });

      const response = await generateSchema(chatInput, selectedType, contextData);
      const rawSchema = response.schema;

      // Store the current schema for future edits
      setCurrentSchema(rawSchema);

      // Add AI response to conversation history
      const aiConversationEntry = {
        role: "assistant",
        content: `Generated ${selectedType} successfully!`,
        timestamp: response.timestamp
      };
      setConversationHistory(prev => [...prev, aiConversationEntry]);

      if (selectedType === 'form') {
        const googleFormPayload = convertSchemaToGoogleForm(rawSchema);

        if (!accessToken) {
          throw new Error("Google access token is missing. Please login again.");
        }

        let formResult;
        
        if (contextData.isEditing && schema?.googleFormId) {
          // EDIT MODE: Update existing form
          console.log('🔄 Editing mode: Updating existing form with ID:', schema.googleFormId);
          
          // Clear existing items first, then add new ones
          await clearGoogleFormItems(schema.googleFormId, accessToken);
          await updateGoogleFormItems(
            schema.googleFormId,
            googleFormPayload.items,
            accessToken
          );
          
          // Update form title if it changed
          await updateGoogleFormTitle(schema.googleFormId, googleFormPayload.info.title, accessToken);
          
          formResult = { formId: schema.googleFormId }; // Keep the same ID
        } else {
          // CREATE MODE: Create new form
          console.log('🆕 Creation mode: Creating new form');
          formResult = await createGoogleForm(googleFormPayload, accessToken);
          
          // Add questions/items with batchUpdate
          await updateGoogleFormItems(
            formResult.formId,
            googleFormPayload.items,
            accessToken
          );
        }

        setSchema({ googleFormId: formResult.formId });
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: contextData.isEditing ? 
              `Updated form successfully!` : 
              `Generated form successfully!`,
            timestamp: response.timestamp,
          },
        ]);
      } else if (selectedType === 'ppt') {
        const googleSlidesPayload = convertSchemaToGoogleSlides(rawSchema);

        console.log('🎨 Generated slides payload:', googleSlidesPayload);

        if (!accessToken) {
          throw new Error("Google access token is missing. Please login again.");
        }

        let slidesResult;

        if (contextData.isEditing && schema?.googleSlidesId) {
          // EDIT MODE: Update existing presentation
          console.log('🔄 Editing mode: Updating existing presentation with ID:', schema.googleSlidesId);
          
          // Clear existing slides first, then add new ones
          await clearGoogleSlidesItems(schema.googleSlidesId, accessToken);
          await updateGoogleSlidesItems(
            schema.googleSlidesId,
            googleSlidesPayload.slides,
            accessToken,
            true // Pass isEditMode = true
          );
          
          // Update presentation title if it changed
          await updateGoogleSlidesTitle(schema.googleSlidesId, googleSlidesPayload.title, accessToken);
          
          slidesResult = { presentationId: schema.googleSlidesId }; // Keep the same ID
        } else {
          // CREATE MODE: Create new presentation
          console.log('🆕 Creation mode: Creating new presentation');
          slidesResult = await createGoogleSlides(googleSlidesPayload, accessToken);
          
          // Add slides with batchUpdate
          await updateGoogleSlidesItems(
            slidesResult.presentationId,
            googleSlidesPayload.slides,
            accessToken,
            false // Pass isEditMode = false
          );
        }

        setSchema({ googleSlidesId: slidesResult.presentationId });
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: contextData.isEditing ? 
              `Updated presentation successfully!` : 
              `Generated presentation successfully!`,
            timestamp: response.timestamp,
          },
        ]);
      } else if (selectedType === 'spreadsheet') {
        const googleSheetsPayload = convertSchemaToGoogleSheets(rawSchema);

        console.log('📊 Generated sheets payload:', googleSheetsPayload);

        if (!accessToken) {
          throw new Error("Google access token is missing. Please login again.");
        }

        let sheetsResult;

        if (contextData.isEditing && schema?.googleSheetsId) {
          // EDIT MODE: Update existing spreadsheet
          console.log('🔄 Editing mode: Updating existing spreadsheet with ID:', schema.googleSheetsId);
          
          // Clear existing sheets data first, then add new data
          await clearGoogleSheetsData(schema.googleSheetsId, accessToken);
          await updateGoogleSheetsData(
            schema.googleSheetsId,
            googleSheetsPayload.sheets,
            accessToken
          );
          
          // Update spreadsheet title if it changed
          await updateGoogleSheetsTitle(schema.googleSheetsId, googleSheetsPayload.title, accessToken);
          
          sheetsResult = { spreadsheetId: schema.googleSheetsId }; // Keep the same ID
        } else {
          // CREATE MODE: Create new spreadsheet
          console.log('🆕 Creation mode: Creating new spreadsheet');
          sheetsResult = await createGoogleSheets(googleSheetsPayload, accessToken);
          
          // Add data with batchUpdate
          await updateGoogleSheetsData(
            sheetsResult.spreadsheetId,
            googleSheetsPayload.sheets,
            accessToken
          );
        }

        setSchema({ googleSheetsId: sheetsResult.spreadsheetId });
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: contextData.isEditing ? 
              `Updated spreadsheet successfully!` : 
              `Generated spreadsheet successfully!`,
            timestamp: response.timestamp,
          },
        ]);
      } else {
        // For other types, just store the schema for now
        setSchema(rawSchema);
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: contextData.isEditing ? 
              `Updated ${selectedType} successfully!` : 
              `Generated ${selectedType} successfully!`,
            timestamp: response.timestamp,
          },
        ]);
      }
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: `Error: ${err.message}`, isError: true },
      ]);
      
      // Add error to conversation history as well
      setConversationHistory(prev => [...prev, {
        role: "assistant",
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setChatInput("");
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        <GoogleLoginButton onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 opacity-40">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-500/20 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float-fast"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        selectedType={selectedType}
        onTypeChange={handleTypeChange} // --- CHANGED LINE ---
        onNewChat={handleNewChat} // --- NEW LINE ---
      />

      {/* Error notification */}

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Top bar controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {user && (
          <>
            <img
              src={user.picture}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-6 z-50 p-2 bg-gray-800/90 backdrop-blur-md rounded-lg border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-300 ease-out transform hover:scale-110 shadow-lg ${isSidebarOpen ? 'left-64 lg:left-64' : 'left-4'
          }`}
        style={{ transition: 'left 0.3s' }}
      >
        <span className="text-white text-lg">
          {isSidebarOpen ? '◀' : '▶'}
        </span>
      </button>

      {/* Main Content Area */}
      <div className={`flex flex-col lg:flex-row w-full h-full gap-4 lg:gap-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}>
        {/* Left Side - Preview Panel (70%) */}

        <div className="w-full lg:w-[70%]">
          <PreviewPanel schema={schema} isLoading={isLoading} selectedType={selectedType} />
        </div>
        <div className="w-full lg:w-[30%] flex flex-col min-w-0">
          <ChatConversation messages={messages} currentSchema={currentSchema} selectedType={selectedType} />
          <ChatInputBox
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            selectedType={selectedType}
            isEditing={messages.length > 0 && currentSchema !== null}
          />
        </div>
      </div>
    </div>
  );
}