const config = require('config');
const AWS = require('aws-sdk');

const {
  region
} = config.get('AWS');

//Define aws region
AWS.config.update({ region });

//Get aws dynamo client instance.
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get an element from a table by his Id.
 * @param {string} TableName Dynamo table name.
 * @param {string} key key field.
 * @param {string} id object id
 * @returns {Promise}.
 */
const getById = (TableName, key, id) => {

  //Make query params.
  const params = {
    TableName,
    KeyConditionExpression: `${key} = :i`,
    ExpressionAttributeValues: {
      ':i': id
    },
    ConsistentRead: true
  };

  //Run query as promise.
  return docClient.query(params).promise();

}

/**
 * Get an element from a table by his Id.
 * @param {string} TableName Dynamo table name.
 * @param {object} query 
 * @returns {Promise}.
 */
const scanItems = (TableName, query) => {

  //Make query params.
  const params = {
    Key: query,
    TableName,
    ConsistentRead: true
  };

  //Run query as promise.
  return docClient.scan(params).promise();

}

/**
 * Get all elements from a dynamo table.
 * @param {string} TableName Dynamo table name.
 * @returns {Promise}.
 */
const getAllElements = (TableName) => {

  //Make the query.
  const params = {
    TableName,
    ConsistentRead: true
  };

  return docClient.scan(params).promise();

}

/**
 * Add elements in a table.
 * @param {string} TableName Dynamo table name.
 * @param {object} element object to be stored in the table.
 * @returns {Promise}.
 */
const addElement = (TableName, element) => {

  //Create params.
  const params = {
    TableName,
    Item: element
  };

  return docClient.put(params).promise();

}

/**
 * Add an element into an array.
 * @param {string} TableName Dynamo table name.
 * @param {string} id Id
 * @param {string} arrayField arrayField
 * @param {object} newElement.
 * @returns {Promise}.
 */
const addElementInArray = (TableName, id, arrayField, newElement) => {

  //Create params.
  const params = {
    TableName,
    Key: { 'client_id': id },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'set #field = list_append(#field,:element)',
    ExpressionAttributeNames: {
      '#field': arrayField
    },
    ExpressionAttributeValues: {
      ':element': [newElement]
    }
  };

  return docClient.update(params).promise();

}

/**
 * Add an element into a list field.
 * @param {string} TableName Dynamo table name.
 * @param {string} id Id
 * @param {string} arrayField arrayField
 * @param {object} newElement.
 * @returns {Promise}.
 */
const addElementInList = (TableName, id, arrayField, newElement) => {

  //Create params.
  const params = {
    TableName,
    Key: id,
    ReturnValues: 'ALL_NEW',
    UpdateExpression: "SET #field = list_append(if_not_exists(#field, :empty_list), :element)",
    ExpressionAttributeNames: {
      '#field': arrayField
    },
    ExpressionAttributeValues: {
      ':element': newElement,
      ':empty_list': []
    }
  };

  return docClient.update(params).promise();

}

/**
 * Add an element into a string set.
 * @param {string} TableName Dynamo table name.
 * @param {string} id Id
 * @param {string} arrayField arrayField
 * @param {object} newElement.
 * @returns {Promise}.
 */
const addElementInStringSet = (TableName, id, arrayField, newElement) => {

  //Create params.
  const params = {
    TableName,
    Key: id,
    ReturnValues: 'ALL_NEW',
    UpdateExpression: "ADD #field :element",
    ExpressionAttributeNames: {
      '#field': arrayField
    },
    ExpressionAttributeValues: {
      ':element': docClient.createSet(newElement)
    }
  };

  return docClient.update(params).promise();

}

/**
 * Create a new string set
 * @param {object} newValue Value to create in the set.
 * @returns {Promise}.
 */
const newStringSet = (newValue) => docClient.createSet(newValue);

/**
 * Update a element in a table.
 * @param {object} newValue Value to create in the set.
 * @returns {Promise}.
 */
const updateElement = (TableName, id, updateField, newValue, condition, isAutoincremental, isStringSet) => {

  //Make update params.
  const params = {
    TableName,
    Key: {
      client_id: id
    },
    UpdateExpression: "set #tmpField = :tmpValue",
    ExpressionAttributeNames: {
      "#tmpField": updateField,
    },
    ExpressionAttributeValues: {
      ":tmpValue": newValue
    },
  }
  if (isAutoincremental) {
    params = {
      TableName,
      Key: {
        client_id: id
      },
      UpdateExpression: "add #tmpField :incr",
      ExpressionAttributeNames: {
        "#tmpField": updateField,
      },
      ExpressionAttributeValues: {
        ":incr": 1,
      },
    }
  }

  if (isStringSet) {
    params = {
      TableName,
      Key: {
        client_id: id
      },
      UpdateExpression: 'ADD #tmpField :new_fields',
      ExpressionAttributeNames: {
        '#tmpField': updateField
      },
      ExpressionAttributeValues: {
        ':new_fields': docClient.createSet(newValue)
      }
    }
  }

  if (condition) {
    params.ExpressionAttributeValues[":B"] = "true"
    params.ConditionExpression = condition;
  }

  params.ReturnValues = "UPDATED_NEW"
  return docClient.update(params).promise();

}

/**
 * Delete a elemeny by his id.
 * @param {string} TableName table to delete the element.
 * @param {string} key Key field
 * @param {string} id
 * @returns {Promise}.
 */
const deleteElement = (TableName, key, id) => {

  //Make update params.
  const params = {
    TableName,
    Key: {
      clientId: id
    },
    ConditionExpression: `${key} = :i`,
    ExpressionAttributeValues: {
      ":i": id
    }
  };

  return docClient.delete(params).promise();
}

/**
 * Run a update query.
 * @param {object} params
 * @returns {Promise}.
 */
const updateQuery = (params) => docClient.update(params).promise();

/**
 *Delete elements from dynamodb table
 * @param {object} params
 * @returns {Promise}.
 */
const deleteQuery = (params) => docClient.delete(params).promise();

module.exports = {
  getAllElements,
  getById,
  scanItems,
  addElement,
  addElementInArray,
  addElementInList,
  addElementInStringSet,
  updateElement,
  deleteElement,
  updateQuery,
  deleteQuery,
  newStringSet
};
