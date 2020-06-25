import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Field, Form, useFormik, FormikHelpers } from "formik";
import "./CreateTaskCondition.css";

import {
  QUERY_PROXY_SALESFORCE_DESCRIBE_OBJECT,
  QUERY_PROXY_SALESFORCE_LIST_ALL_OBJECTS,
  MUTATION_CREATE_TASK_CONDITION,
} from "../../graphql/queries";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface PicklistItem {
  value: string;
  label: string;
}

const droppableIDInitial = "initial";
const droppableIDPreTarget = "pre-target";
const droppableIDTarget = "target";
const droppableIDDisqualifying = "disqualifying";

const grid = 8;
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

// a little function to help us with reordering the result
const reorder = (
  list: PicklistItem[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

interface FormValues {
    object_type: string;
    field_name: string;
    pre_target_values: string[],
    target_values: string[],
    disqualifying_values: string[],
    name: string;
}

export default () => {
  const [objectType, setObjectType] = useState("");
  const [objectLabel, setObjectLabel] = useState("");

  const [fieldName, setFieldName] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");

  const [hasMovedItems, setHasMovedItems] = useState(false);
  const [initialItems, setInitialItems] = useState([] as PicklistItem[]);
  const [preTargetItems, setPreTargetItems] = useState([] as PicklistItem[]);
  const [targetItems, setTargetItems] = useState([] as PicklistItem[]);
  const [disqualifierItems, setDisqualifierItems] = useState(
    [] as PicklistItem[]
  );

  const {
    data: all_objects_data,
    loading: all_objects_loading,
    error: all_objects_error,
  } = useQuery(QUERY_PROXY_SALESFORCE_LIST_ALL_OBJECTS);

  const {
    data: describe_object_data,
    loading: describe_object_loading,
    error: describe_object_error,
  } = useQuery(QUERY_PROXY_SALESFORCE_DESCRIBE_OBJECT, {
    skip: objectType === "",
    variables: { name: objectType },
  });

  const [create_task_condition, { data: create_task_condition_data, error: create_task_condition_error, loading: create_task_condition_loading }] = useMutation(
    MUTATION_CREATE_TASK_CONDITION,
    {onError: (err) => {
      console.log(err)
    }}
  );

  const formik = useFormik({
    initialValues: {
      object_type: "",
      field_name: "",
      pre_target_values: [],
      target_values: [],
      disqualifying_values: [],
      name: "",
    } as FormValues,
    onSubmit: (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
      console.log(values)
      create_task_condition({variables: {input: values}})
      formikHelpers.setSubmitting(false)
    },
    onReset: () => {

    },
  })

  if (all_objects_loading) {
    return <div>Loading All Objects...</div>;
  }

  if (describe_object_error) {
    console.log(describe_object_error);
    return <div>{JSON.stringify(describe_object_error)}</div>;
  }
  
  if (all_objects_error) {
    console.log(all_objects_error);
    return <div>{JSON.stringify(all_objects_error)}</div>;
  }

  const getObjectByName = (name: string): any => {
    return all_objects_data.proxy_salesforce_list_all_objects.filter(
      (obj: any) => obj.name === name
    )[0];
  };

  const getFieldByName = (name: string): any => {
    return describe_object_data.proxy_salesforce_describe_object.filter(
      (field: any) => field.name === name
    )[0];
  };

  const getList = (id: string): PicklistItem[] => {
    switch (id) {
      case droppableIDInitial:
        return initialItems;
      case droppableIDPreTarget:
        return preTargetItems;
      case droppableIDTarget:
        return targetItems;
      case droppableIDDisqualifying:
        return disqualifierItems;
      default:
        return [];
    }
  };

  const setList = (id: string, items: PicklistItem[]): void => {
    let values = items.map((i) => i.value);

    console.log("ITEMS", items)

    switch (id) {
      case droppableIDInitial:
        setInitialItems(items);
        break;
      case droppableIDPreTarget:
        setPreTargetItems(items);
        formik.setFieldValue("pre_target_values", values);
        break;
      case droppableIDTarget:
        setTargetItems(items);
        formik.setFieldValue("target_values", values);
        break;
      case droppableIDDisqualifying:
        setDisqualifierItems(items);
        formik.setFieldValue("disqualifying_values", values);
        break;
      default:
        console.error("unknown list: ", id);
    }
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: any,
    destination: any,
    droppableSource: any,
    droppableDestination: any
  ) => {
    setHasMovedItems(true);
    const sourceClone = Array.from(source) as PicklistItem[];
    const destClone = Array.from(destination) as PicklistItem[];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    setList(droppableSource.droppableId, sourceClone);
    setList(droppableDestination.droppableId, destClone);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    console.log({ source, destination });

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      setList(source.droppableId, items);
    } else {
      move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
    }
  };

  return (
    <div className="ProgressesPage">
<form       
        onSubmit={formik.handleSubmit}
      >
        <label htmlFor="name">Name</label>
          <input
            name="name"
            type="text"
            value={formik.values.name}
            onChange={(e: any) => {
              const value = e.target.value;
              // formik.setFieldValue("name", value);
              formik.handleChange(e)
            }}
          />
          <label htmlFor="object_type">Object</label>
          <select
            name="object_type"
            value={formik.values.object_type}
            onChange={(e: any) => {
              const value = e.target.value;
              const object = getObjectByName(value);
              setObjectType(value);
              setObjectLabel(object.label);
              // formik.setFieldValue("object_type", value);
              formik.handleChange(e)
            }}
          >
            <option value="">(Select an Object)</option>
            {all_objects_data.proxy_salesforce_list_all_objects.map(
              (obj: any) => (
                <option key={obj.name} value={obj.name}>
                  {obj.label}
                </option>
              )
            )}
          </select>
          {describe_object_loading && (
            <div>Loading Properties of {objectType}...</div>
          )}
          {describe_object_data && (
            <>
              <label htmlFor="field_name">Field</label>
              <select
                name="field_name"
                value={formik.values.field_name}
                onChange={(e: any) => {
                  const value = e.target.value;
                  const field = getFieldByName(value);
                  setFieldName(value);
                  setFieldLabel(field.label);
                  setInitialItems(field.picklist_values);
                  // formik.setFieldValue("field_name", value);
                  formik.handleChange(e)
                }}
              >
                <option value="">(Select an Field)</option>
                {describe_object_data.proxy_salesforce_describe_object.map(
                  (obj: any) => (
                    <option key={obj.name} value={obj.name}>
                      {obj.label}
                    </option>
                  )
                )}
              </select>
            </>
          )}
          {(initialItems.length > 0 || hasMovedItems) && (
            <div className="droppable-wrapper">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="droppable-and-title">
                  <label htmlFor="initial-droppable-wrapper">All Values</label>
                  <div className="initial-droppable-wrapper droppable">
                    <Droppable droppableId={droppableIDInitial}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                          {initialItems.map((item, index) => (
                            <Draggable
                              key={item.value}
                              draggableId={item.value}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.value}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
                <div className="droppable-and-title">
                  <label htmlFor="pre-targets-droppable-wrapper">
                    Pre-Target (Optional)
                  </label>
                  <div className="pre-targets-droppable-wrapper droppable">
                    <Droppable droppableId={droppableIDPreTarget}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                          {preTargetItems.map((item, index) => (
                            <Draggable
                              key={item.value}
                              draggableId={item.value}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.value}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
                <div className="droppable-and-title">
                  <label htmlFor="target-droppable-wrapper">
                    Target Values
                  </label>
                  <div className="target-droppable-wrapper droppable">
                    <Droppable droppableId={droppableIDTarget}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                          {targetItems.map((item, index) => (
                            <Draggable
                              key={item.value}
                              draggableId={item.value}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.value}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
                <div className="droppable-and-title">
                  <label htmlFor="disqualifying-droppable-wrapper">
                    Disqualifying Values
                  </label>
                  <div className="disqualifying-droppable-wrapper droppable">
                    <Droppable droppableId={droppableIDDisqualifying}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                          {disqualifierItems.map((item, index) => (
                            <Draggable
                              key={item.value}
                              draggableId={item.value}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.value}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </DragDropContext>
            </div>
          )}
          {(initialItems.length > 0 || hasMovedItems) && (
            <button type="submit" disabled={formik.isSubmitting}>
              Submit
            </button>
          )}
      </form>
    </div>
  );
};

// export default withFormik({
//   handleSubmit: (values: formik.values, { setSubmitting }) => {
//     console.log("SUBMITTING", values);
//     setTimeout(() => {
      
//       setSubmitting(false);
//     }, 1000);
//   },
// })(InnerForm);
