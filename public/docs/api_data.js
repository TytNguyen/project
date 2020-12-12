define({ "api": [
  {
    "type": "POST",
    "url": "/v1/auth/attendances",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "Attendances",
    "permission": [
      {
        "name": "just administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create attendances by admin or moderator</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mid",
            "description": "<p>ID of meeting</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sid",
            "description": "<p>ID of stakeholder</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>1: register <br/> 2: attented <br/> 3: rejected</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/attendances",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Attendance.js",
    "groupTitle": "Attendances"
  },
  {
    "type": "GET",
    "url": "/v1/auth/attendances/meeting/:id",
    "title": "Get Meeting Stakeholder Attend",
    "version": "1.0.0",
    "name": "getMeetingStakeholderAttend",
    "group": "Attendances",
    "permission": [
      {
        "name": "administrator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get Meeting Stakeholder Attend</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of Stakeholder, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sid",
            "description": "<p>stakeholder's id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mid",
            "description": "<p>meeting's id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>title of meeting</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>meeting's description</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "begin",
            "description": "<p>begin date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>end date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>1: waiting for accept <br/>   2: accepted <br/>   3: rejected</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_id",
            "description": "<p>category's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mainsubject",
            "description": "<p>category's name</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/attendances/meeting/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of group</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"data\": [\n                    {\n                        \"sid\": 3,\n                        \"mid\": 1,\n                        \"status\": 2,\n                        \"meeting\": {\n                            \"title\": \"Sản phẩm công nghệ tương lai\",\n                            \"description\": \"Giới thiệu\",\n                            \"begin\": \"2020-12-20T10:00:00.000Z\",\n                            \"end\": null,\n                            \"category\": {\n                                \"id\": 1,\n                                \"mainsubject\": \"Hóa học\"\n                            }\n                        }\n                    },\n                    {\n                        \"sid\": 3,\n                        \"mid\": 2,\n                        \"status\": 1,\n                        \"meeting\": {\n                            \"title\": \"Sinh hóa học\",\n                            \"description\": \"Giới thiệu\",\n                            \"begin\": \"2020-12-20T09:00:00.000Z\",\n                            \"end\": null,\n                            \"category\": {\n                                \"id\": 2,\n                                \"mainsubject\": \"Sinh học\"\n                            }\n                        }\n                    }\n                ],\n                \"pages\": {\n                    \"current\": 1,\n                    \"prev\": 0,\n                    \"hasPrev\": false,\n                    \"next\": 0,\n                    \"hasNext\": false,\n                    \"total\": 1\n                },\n                \"items\": {\n                    \"begin\": 1,\n                    \"end\": 25,\n                    \"total\": 2\n                }\n            },\n            \"message\": \"\",\n            \"result\": \"ok\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Attendance.js",
    "groupTitle": "Attendances"
  },
  {
    "type": "GET",
    "url": "/v1/auth/attendances/stakeholder/:id",
    "title": "Get Stakeholder Attend that meeting",
    "version": "1.0.0",
    "name": "getStakeholderAttendMeeting",
    "group": "Attendances",
    "permission": [
      {
        "name": "administrator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get Stakeholder Attend Meeting</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of Meeting, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sid",
            "description": "<p>stakeholder's id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mid",
            "description": "<p>meeting's id</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/attendances/stakeholder/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "taxcode",
            "description": "<p>taxcode of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>address of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>phone of stakeholder</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"data\": [\n                    {\n                        \"sid\": 3,\n                        \"mid\": 1,\n                        \"status\": 2,\n                        \"stakeholder\": {\n                            \"name\": \"Lab 1\",\n                            \"taxcode\": \"0121213\",\n                            \"address\": \"Phú Nhuận\",\n                            \"phone\": \"23123123123123\",\n                            \"type\": 2\n                        }\n                    },\n                    {\n                        \"sid\": 1,\n                        \"mid\": 1,\n                        \"status\": 1,\n                        \"stakeholder\": {\n                            \"name\": \"Cty Nam Phương\",\n                            \"taxcode\": \"123455678\",\n                            \"address\": \"Bình Thạnh\",\n                            \"phone\": \"0123456789\",\n                            \"type\": 1\n                        }\n                    },\n                    {\n                        \"sid\": 6,\n                        \"mid\": 1,\n                        \"status\": 0,\n                        \"stakeholder\": {\n                            \"name\": \"Cty TNHH Bình Minh\",\n                            \"taxcode\": \"232313123321\",\n                            \"address\": \"Quận 3\",\n                            \"phone\": \"32312312312\",\n                            \"type\": 1\n                        }\n                    }\n                ],\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Attendance.js",
    "groupTitle": "Attendances"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/attendances",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "Attendances",
    "permission": [
      {
        "name": "administrator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update attendances status</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mid",
            "description": "<p>ID of meeting</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sid",
            "description": "<p>ID of stakeholder</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>1: register <br/> 2: attented <br/> 3: rejected</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/attendances",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"mid: 33 sid: 16\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Attendance.js",
    "groupTitle": "Attendances"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/attendances/:id",
    "title": "Accept Company attend Metting",
    "version": "1.0.0",
    "name": "update",
    "group": "Attendances",
    "permission": [
      {
        "name": "administrator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update attendances status</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mid",
            "description": "<p>ID of meeting, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ids",
            "description": "<p>list ID of stakeholder</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/attendances/33",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"mid: 33 sid: 16\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Attendance.js",
    "groupTitle": "Attendances"
  },
  {
    "type": "POST",
    "url": "/v1/auth/category",
    "title": "Create One",
    "version": "1.0.0",
    "name": "createCategory",
    "group": "Category",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create Category by admin, moderator</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mainsubject",
            "description": "<p>category's name</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/category",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created category</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Category.js",
    "groupTitle": "Category"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/category/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "Category",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete category</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of category</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/category/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted category</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Category.js",
    "groupTitle": "Category"
  },
  {
    "type": "GET",
    "url": "/v1/auth/category",
    "title": "Get List",
    "version": "1.0.0",
    "name": "getAll",
    "group": "Category",
    "permission": [
      {
        "name": "type of user >= 3, if type < 3, just get the category they create"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all category</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/category/",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of category</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "mainsubject",
            "description": "<p>category's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of category</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>subcategory's name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": [...],\n  \"items\": {\"begin\": 1, \"end\": 3, \"total\": 5},\n  \"pages\": {\"current\": 1, \"prev\": 3, \"hasPrev\": true, \"next\": 5, \"hasNext\": true, \"total\": 56},\n  \"result\": \"ok\",\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Category.js",
    "groupTitle": "Category"
  },
  {
    "type": "GET",
    "url": "/v1/auth/category/:id",
    "title": "Get One",
    "version": "1.0.0",
    "name": "getOne",
    "group": "Category",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get one category</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of category, on params</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/category/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of category</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "mainsubject",
            "description": "<p>category's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of category</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>subcategory's name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"count\": 10,\n                \"rows\": [\n                    {\n                        \"id\": 1,\n                        \"mainsubject\": \"Hóa học\",\n                        \"status\": 1,\n                        \"createdBy\": 1,\n                        \"updatedBy\": 1,\n                        \"createdAt\": \"2020-10-21T15:08:24.000Z\",\n                        \"updatedAt\": \"2020-10-21T15:08:24.000Z\",\n                        \"subcategories\": [\n                            {\n                                \"id\": 1,\n                                \"subject\": \"Hóa hữu cơ\"\n                            },\n                            {\n                                \"id\": 2,\n                                \"subject\": \"Hóa lý\"\n                            },\n                            {\n                                \"id\": 3,\n                                \"subject\": \"Hóa dầu\"\n                            },\n                            {\n                                \"id\": 4,\n                                \"subject\": \"Hóa phân tích\"\n                            },\n                            {\n                                \"id\": 5,\n                                \"subject\": \"Hóa lập thể\"\n                            },\n                            {\n                                \"id\": 6,\n                                \"subject\": \"Hóa vô cơ và ứng dụng\"\n                            },\n                            {\n                                \"id\": 7,\n                                \"subject\": \"Hóa polymer\"\n                            },\n                            {\n                                \"id\": 8,\n                                \"subject\": \"Hóa dược\"\n                            },\n                            {\n                                \"id\": 9,\n                                \"subject\": \"Hóa lượng tử\"\n                            },\n                            {\n                                \"id\": 10,\n                                \"subject\": \"Hóa thực phẩm\"\n                            }\n                        ]\n                    }\n                ]\n            },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Category.js",
    "groupTitle": "Category"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/category/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "Category",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update category information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of category, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "mainsubject",
            "description": "<p>category's name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>category's status</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/category/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated category</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Category.js",
    "groupTitle": "Category"
  },
  {
    "type": "POST",
    "url": "/v1/auth/hashtags",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "Hashtags",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create by admin, moderator</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Hashtag's value</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Hashtag's type <br/> 1: location <br/> 2: type <br/> 3: description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>Hashtag's status</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/hashtags",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created hashtags</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Hashtag.js",
    "groupTitle": "Hashtags"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/hashtags/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "Hashtags",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete hashtags</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of hashtags</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/hashtags/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted hashtags</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Hashtag.js",
    "groupTitle": "Hashtags"
  },
  {
    "type": "GET",
    "url": "/v1/auth/hashtags",
    "title": "Get All",
    "version": "1.0.0",
    "name": "getAll",
    "group": "Hashtags",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all hashtag and type</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/hashtags",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "value",
            "description": "<p>Hashtag's value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>Hashtag's type <br/> 1: location <br/> 2: type <br/> 3: description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>Hashtag's status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n            \"count\": 45,\n            \"rows\": [\n                {\n                    \"id\": 20,\n                    \"value\": \"Hà Nội\",\n                    \"type\": 1,\n                    \"status\": 1,\n                    \"createdBy\": 1,\n                    \"updatedBy\": 1,\n                    \"createdAt\": \"2020-09-23T11:26:05.000Z\",\n                    \"updatedAt\": \"2020-09-23T11:26:05.000Z\"\n                },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Hashtag.js",
    "groupTitle": "Hashtags"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/hashtags/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "Hashtags",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update Hashtags information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of category, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Hashtag's value</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Hashtag's type <br/> 1: location <br/> 2: type <br/> 3: description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Hashtag's status</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/hashtags/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated hashtags</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Hashtag.js",
    "groupTitle": "Hashtags"
  },
  {
    "type": "POST",
    "url": "/v1/auth/labresult",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "LabResult",
    "permission": [
      {
        "name": "user with the right type, administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create user by admin, moderator and user belongs to LabResult</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>labresult's title</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ids",
            "description": "<p>Hashtag's list</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lid",
            "description": "<p>lab's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subcategory_id",
            "description": "<p>subcategory's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>labresult's description</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/labresult",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created labresult</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/LabResult.js",
    "groupTitle": "LabResult"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/labresult/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "LabResult",
    "permission": [
      {
        "name": "user with the right type, administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete labresult</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of labresult</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/labresult/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted labresult</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/LabResult.js",
    "groupTitle": "LabResult"
  },
  {
    "type": "GET",
    "url": "/v1/auth/labresult",
    "title": "Get List",
    "version": "1.0.0",
    "name": "getAll",
    "group": "LabResult",
    "permission": [
      {
        "name": "type of user >= 3, if type < 3, just get the labresult they create"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all labresult</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/labresult/",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of labresult</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>labresult's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>labresult's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of labresult</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "stakeholder_name",
            "description": "<p>Company's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subcategory",
            "description": "<p>subcategory's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hashtag_id",
            "description": "<p>hashtag id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>hashtag's value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>hashtag's type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": [...],\n  \"items\": {\"begin\": 1, \"end\": 3, \"total\": 5},\n  \"pages\": {\"current\": 1, \"prev\": 3, \"hasPrev\": true, \"next\": 5, \"hasNext\": true, \"total\": 56},\n  \"result\": \"ok\",\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/LabResult.js",
    "groupTitle": "LabResult"
  },
  {
    "type": "GET",
    "url": "/v1/auth/labresult/:id",
    "title": "Get One",
    "version": "1.0.0",
    "name": "getOne",
    "group": "LabResult",
    "permission": [
      {
        "name": "type of user >= 3, if type < 3, just get the labresult they create"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get one labresult</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of labresult, on params</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/labresult/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of labresult</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>labresult's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>labresult's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>status of labresult</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "stakeholder_name",
            "description": "<p>Company's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "subcategory",
            "description": "<p>subcategory's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "hashtag_id",
            "description": "<p>hashtag id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "value",
            "description": "<p>hashtag's value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>hashtag's type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n         \"id\": 1,\n                \"title\": \"Công nghệ trồng lúa\",\n                \"description\": \"Sản phẩm hỗ trợ trồng cây ít bị hư\",\n                \"status\": 1,\n                \"createdAt\": \"2020-10-01T13:03:23.000Z\",\n                \"updatedAt\": \"2020-10-01T13:03:23.000Z\",\n                \"createdBy\": 1,\n                \"updatedBy\": 1,\n                \"stakeholder\": {\n                    \"name\": \"Cty Nam Phương\"\n                },\n                \"subcategory\": {\n                    \"subject\": \"Vi sinh\"\n                },\n                \"match_hashtags\": [\n                    {\n                        \"hashtag_id\": 51,\n                        \"hashtag\": {\n                            \"value\": \"phòng bệnh\",\n                            \"type\": 3\n                        }\n                    },\n                    {\n                        \"hashtag_id\": 23,\n                        \"hashtag\": {\n                            \"value\": \"Hải Phòng\",\n                            \"type\": 1\n                        }\n                    },\n                    {\n                        \"hashtag_id\": 26,\n                        \"hashtag\": {\n                            \"value\": \"năng lực nghiên cứu\",\n                            \"type\": 2\n                        }\n                    }\n                ]\n            },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/LabResult.js",
    "groupTitle": "LabResult"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/labresult/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "LabResult",
    "permission": [
      {
        "name": "user with the right type, administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update labresult information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of labresult, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>labresult's title</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "delete_ids",
            "description": "<p>Hashtag's list that deleted</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ids",
            "description": "<p>Hashtag's list that added to table</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lid",
            "description": "<p>lab's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subcategory_id",
            "description": "<p>subcategory's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>profile's description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of profile</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/labresult/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated labresult</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/LabResult.js",
    "groupTitle": "LabResult"
  },
  {
    "type": "GET",
    "url": "/v1/auth/matching/automatching",
    "title": "Get the matchest one of your requirement",
    "version": "1.0.0",
    "name": "autoMatching",
    "group": "Matching",
    "permission": [
      {
        "name": "type of user < 3"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Auto find the matchest one of your requirement</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of requirement</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sub_id",
            "description": "<p>ID of subcategory</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/matching/automatching",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of matching result</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>result's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>result's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>result's status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subcategory",
            "description": "<p>subcategory of result</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hashtag",
            "description": "<p>hashtag of result</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "percent_matching",
            "description": "<p>percent matching</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"id\": 12,\n                \"title\": \"Title 1\",\n                \"description\": \"Sản phẩm công nghệ cao\",\n                \"status\": 1,\n                \"createdAt\": \"2020-10-24T16:25:37.000Z\",\n                \"updatedAt\": \"2020-10-24T16:37:52.000Z\",\n                \"createdBy\": 1,\n                \"updatedBy\": 1,\n                \"subcategory\": {\n                    \"id\": 1,\n                    \"subject\": \"Hóa hữu cơ\"\n                },\n               \"match_hashtags\": [\n                {\n                    \"hashtag_id\": 26,\n                    \"hashtag\": {\n                        \"value\": \"năng lực nghiên cứu\",\n                        \"type\": 2\n                    }\n                }],\n                \"percent_matching\": 50},\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Matching.js",
    "groupTitle": "Matching"
  },
  {
    "type": "POST",
    "url": "/v1/auth/matching",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "Matching",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Create matching by user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "profileId",
            "description": "<p>Enterprise Profile id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "resultId",
            "description": "<p>Lab Result id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "step",
            "description": "<p>process's step</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>1: auto <br/>  2: request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isCompany",
            "description": "<p>1: true <br/>  0: false</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/matching",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>the matching data with token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>ok or fail</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>something from server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n     \"profileId\": \"12\",\n     \"resultId\":2,\n     \"type\": \"1\",\n     \"isCompany\": \"1\"\n     \"status\": 1\n  },\n  \"result\": \"ok\",\n  \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Matching.js",
    "groupTitle": "Matching"
  },
  {
    "type": "GET",
    "url": "/v1/auth/matching",
    "title": "Get List",
    "version": "1.0.0",
    "name": "getAll",
    "group": "Matching",
    "permission": [
      {
        "name": "Admin or moderate"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all matching</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/matching/",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of matching</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of matching</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>matching's type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "isCompany",
            "description": "<p>Company send this request or not</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "enterpriseprofile_id",
            "description": "<p>enterpriseprofile's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "enterpriseprofile_title",
            "description": "<p>enterpriseprofile's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "labresult_id",
            "description": "<p>labresult's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "labresult_title",
            "description": "<p>labresult's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "processes_id",
            "description": "<p>processes's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "step",
            "description": "<p>matching's step</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": [...],\n  \"items\": {\"begin\": 1, \"end\": 3, \"total\": 5},\n  \"pages\": {\"current\": 1, \"prev\": 3, \"hasPrev\": true, \"next\": 5, \"hasNext\": true, \"total\": 56},\n  \"result\": \"ok\",\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Matching.js",
    "groupTitle": "Matching"
  },
  {
    "type": "GET",
    "url": "/v1/auth/matching/:id",
    "title": "Get One",
    "version": "1.0.0",
    "name": "getOne",
    "group": "Matching",
    "permission": [
      {
        "name": "type of user >= 3, if type < 3, just get the matching they create"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get one matching</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of matching, on paramss</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/matching/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of matching</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of matching</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>matching's type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "isCompany",
            "description": "<p>Company send this request or not</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "enterpriseprofile_id",
            "description": "<p>enterpriseprofile's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "enterpriseprofile_title",
            "description": "<p>enterpriseprofile's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "labresult_id",
            "description": "<p>labresult's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "labresult_title",
            "description": "<p>labresult's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "processes_id",
            "description": "<p>processes's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "step",
            "description": "<p>matching's step</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"id\": 1,\n                \"status\": 5,\n                \"type\": 1,\n                \"isCompany\": 1,\n                \"createdAt\": \"2020-10-01T13:04:58.000Z\",\n                \"updatedAt\": \"2020-10-15T20:43:38.000Z\",\n                \"createdBy\": 1,\n                \"updatedBy\": 1,\n                \"enterpriseprofile\": {\n                    \"id\": 1,\n                    \"title\": \"Công nghệ trồng lúa\"\n                },\n                \"labresult\": {\n                    \"id\": 1,\n                    \"title\": \"Title 1\"\n                },\n                \"processes\": [\n                    {\n                        \"id\": 1,\n                        \"step\": 1\n                    },\n                    {\n                        \"id\": 3,\n                        \"step\": 3\n                    },\n                    {\n                        \"id\": 27,\n                        \"step\": 4\n                    },\n                    {\n                        \"id\": 28,\n                        \"step\": 5\n                    }\n                ]\n            },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Matching.js",
    "groupTitle": "Matching"
  },
  {
    "type": "GET",
    "url": "/v1/auth/matching/recommendation",
    "title": "Get recommendation list",
    "version": "1.0.0",
    "name": "recommendation",
    "group": "Matching",
    "permission": [
      {
        "name": "type of user < 3"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get list match with your requirement</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of requirement</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sub_id",
            "description": "<p>ID of subcategory of requirement</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/matching/recommendationa",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of matching result</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>result's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>result's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>result's status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subcategory",
            "description": "<p>subcategory of result</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hashtag",
            "description": "<p>hashtag of result</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "percent_matching_list",
            "description": "<p>percent matching list with id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n          \"id\": 12,\n          \"title\": \"Title 1\",\n          \"description\": \"Sản phẩm công nghệ cao\",\n          \"status\": 1,\n          \"createdAt\": \"2020-10-24T16:25:37.000Z\",\n          \"updatedAt\": \"2020-10-24T16:37:52.000Z\",\n          \"createdBy\": 1,\n          \"updatedBy\": 1,\n          \"subcategory\": {\n              \"id\": 1,\n              \"subject\": \"Hóa hữu cơ\"\n          },\n         \"match_hashtags\": [\n          {\n              \"hashtag_id\": 26,\n              \"hashtag\": {\n                  \"value\": \"năng lực nghiên cứu\",\n                  \"type\": 2\n              }\n          }],\n          \"percent_matching_list\": [\n              [\n                  12,\n                  0.5\n              ],\n              [\n                  1,\n                 0.3333\n              ],\n              [\n                  5,\n                  0.1667\n              ]\n          ]\n      },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Matching.js",
    "groupTitle": "Matching"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/matching/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "Matching",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update matching and processes information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "step",
            "description": "<p>1: waiting for accept <br/> 2: Accept (call the client, choose date to meeting) <br/> 3: organize the meeting <br/> 4: waiting for accept agreement <br/> 5: contract <br/> 6: support <br/> 7: Done <br/> 8: Pending <br/> 9: Canceled <br/> 10: Rejected</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "note",
            "description": "<p>note for step</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/matching/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated matching</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Matching.js",
    "groupTitle": "Matching"
  },
  {
    "type": "POST",
    "url": "/v1/auth/meetings",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "Meetings",
    "permission": [
      {
        "name": "just administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create meetings by admin or moderator</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>title of meeting</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>meeting's description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_id",
            "description": "<p>category's id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "begin",
            "description": "<p>begin date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>end date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limited",
            "description": "<p>maximun number of people attend</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "currentAttend",
            "description": "<p>number of people have register</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/meetings",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created meeting</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Meeting.js",
    "groupTitle": "Meetings"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/meetings/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "Meetings",
    "permission": [
      {
        "name": "just admin user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete meetings</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of meetings</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/meetings/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted meetings</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Meeting.js",
    "groupTitle": "Meetings"
  },
  {
    "type": "GET",
    "url": "/v1/auth/meetings",
    "title": "Get List",
    "version": "1.0.0",
    "name": "getAll",
    "group": "Meetings",
    "permission": [
      {
        "name": "administrator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all meetings</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page which we want to get (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "perPage",
            "description": "<p>Item per page (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>Sort the list by a field (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filter",
            "description": "<p>filter the query data (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Text filter for data (N/A)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/meetings",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>the list of data</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "items",
            "description": "<p>{begin, end, total}</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "pages",
            "description": "<p>{current, prev, hasPrev, next, hasNext, total}</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>ok or fail</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>something from server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": [...],\n  \"items\": {\"begin\": 1, \"end\": 3, \"total\": 5},\n  \"pages\": {\"current\": 1, \"prev\": 3, \"hasPrev\": true, \"next\": 5, \"hasNext\": true, \"total\": 56},\n  \"result\": \"ok\",\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Meeting.js",
    "groupTitle": "Meetings"
  },
  {
    "type": "GET",
    "url": "/v1/auth/meetings/:id",
    "title": "Get One",
    "version": "1.0.0",
    "name": "getOne",
    "group": "Meetings",
    "permission": [
      {
        "name": "Every type of user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get one meetings</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of meetings, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>title of meeting</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>meeting's description</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "begin",
            "description": "<p>begin date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>end date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>1: actived <br/> 0: expired</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limited",
            "description": "<p>maximun number of people attend</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "currentAttend",
            "description": "<p>number of people have register</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_id",
            "description": "<p>category's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mainsubject",
            "description": "<p>category's name</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/meetings/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of group</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"id\": 1,\n                \"title\": \"Sản phẩm công nghệ tương lai\",\n                \"description\": \"Giới thiệu\",\n                \"begin\": \"2020-12-20T10:00:00.000Z\",\n                \"end\": null,\n                \"limited\": 11,\n                \"currentAttend\": 2,\n                \"status\": 1,\n                \"createdAt\": \"2020-09-17T10:52:33.000Z\",\n                \"updatedAt\": \"2020-09-17T10:52:33.000Z\",\n                \"createdBy\": 1,\n                \"updatedBy\": 1,\n                \"category\": {\n                    \"id\": 1,\n                    \"mainsubject\": \"Hóa học\"\n                }\n            },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Meeting.js",
    "groupTitle": "Meetings"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/meetings/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "Meetings",
    "permission": [
      {
        "name": "Every type of user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update meetings information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of meetings, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "title",
            "description": "<p>title of meeting</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "description",
            "description": "<p>meeting's description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "category_id",
            "description": "<p>category's id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "begin",
            "description": "<p>begin date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "end",
            "description": "<p>end date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>1: actived <br/> 0: expired</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "limited",
            "description": "<p>maximun number of people attend</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/meetings/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated meetings</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Meeting.js",
    "groupTitle": "Meetings"
  },
  {
    "type": "POST",
    "url": "/v1/auth/profile",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "Profile",
    "permission": [
      {
        "name": "user with the right type, administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create user by admin, moderator and user belongs to Company</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>profile's title</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ids",
            "description": "<p>Hashtag's list</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cid",
            "description": "<p>company's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subcategory_id",
            "description": "<p>subcategory's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>profile's description</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/profile",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created profile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/EnterpriseProfile.js",
    "groupTitle": "Profile"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/profile/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "Profile",
    "permission": [
      {
        "name": "user with the right type, administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete profile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of profile</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/profile/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted profile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/EnterpriseProfile.js",
    "groupTitle": "Profile"
  },
  {
    "type": "GET",
    "url": "/v1/auth/profile",
    "title": "Get List",
    "version": "1.0.0",
    "name": "getAll",
    "group": "Profile",
    "permission": [
      {
        "name": "type of user >= 3, if type < 3, just get the profile they create"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all profile</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/profile/",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of profile</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>profile's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>profile's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of profile</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "stakeholder_name",
            "description": "<p>Company's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subcategory",
            "description": "<p>subcategory's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hashtag_id",
            "description": "<p>hashtag id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>hashtag's value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>hashtag's type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": [...],\n  \"items\": {\"begin\": 1, \"end\": 3, \"total\": 5},\n  \"pages\": {\"current\": 1, \"prev\": 3, \"hasPrev\": true, \"next\": 5, \"hasNext\": true, \"total\": 56},\n  \"result\": \"ok\",\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/EnterpriseProfile.js",
    "groupTitle": "Profile"
  },
  {
    "type": "GET",
    "url": "/v1/auth/profile/:id",
    "title": "Get One",
    "version": "1.0.0",
    "name": "getOne",
    "group": "Profile",
    "permission": [
      {
        "name": "type of user >= 3, if type < 3, just get the profile they create"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get one profile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of profile, on params</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/profile/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of profile</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>profile's title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>profile's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of profile</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "stakeholder_name",
            "description": "<p>Company's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subcategory",
            "description": "<p>subcategory's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hashtag_id",
            "description": "<p>hashtag id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>hashtag's value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>hashtag's type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"id\": 1,\n                \"title\": \"Công nghệ trồng lúa\",\n                \"description\": \"Sản phẩm hỗ trợ trồng cây ít bị hư\",\n                \"status\": 1,\n                \"createdAt\": \"2020-10-01T13:03:23.000Z\",\n                \"updatedAt\": \"2020-10-01T13:03:23.000Z\",\n                \"createdBy\": 1,\n                \"updatedBy\": 1,\n                \"stakeholder\": {\n                    \"id\": 1,\n                    \"name\": \"Cty Nam Phương\"\n                },\n                \"subcategory\": {\n                    \"id\": 33,\n                    \"subject\": \"Vi sinh\"\n                },\n                \"match_hashtags\": [\n                    {\n                        \"hashtag_id\": 51,\n                        \"hashtag\": {\n                            \"value\": \"phòng bệnh\",\n                            \"type\": 3\n                        }\n                    },\n                    {\n                        \"hashtag_id\": 23,\n                        \"hashtag\": {\n                            \"value\": \"Hải Phòng\",\n                            \"type\": 1\n                        }\n                    },\n                    {\n                        \"hashtag_id\": 26,\n                        \"hashtag\": {\n                            \"value\": \"năng lực nghiên cứu\",\n                            \"type\": 2\n                        }\n                    }\n                ]\n            },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/EnterpriseProfile.js",
    "groupTitle": "Profile"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/profile/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "Profile",
    "permission": [
      {
        "name": "user with the right type, administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update profile information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of profile, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "title",
            "description": "<p>profile's title</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "delete_ids",
            "description": "<p>Hashtag's list that deleted</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "ids",
            "description": "<p>Hashtag's list that added to table</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "cid",
            "description": "<p>company's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "subcategory_id",
            "description": "<p>subcategory's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>profile's description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>status of profile</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/profile/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated profile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/EnterpriseProfile.js",
    "groupTitle": "Profile"
  },
  {
    "type": "POST",
    "url": "/v1/auth/stakeholder",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "Stakeholder",
    "permission": [
      {
        "name": "just administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create user by admin, moderator and user that has status similar with the stakeholder status</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>name of company or lab</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "taxcode",
            "description": "<p>company or lab's taxcode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "district",
            "description": "<p>company or lab's district</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "detailaddress",
            "description": "<p>company or lab's detail address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>company or lab's phone</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>1: company <br/>   2: lab</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/stakeholder",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created stakeholder</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Stakeholder.js",
    "groupTitle": "Stakeholder"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/stakeholder/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "Stakeholder",
    "permission": [
      {
        "name": "just admin user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete stakeholder</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of stakeholder</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/stakeholder/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted stakeholder</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Stakeholder.js",
    "groupTitle": "Stakeholder"
  },
  {
    "type": "GET",
    "url": "/v1/auth/stakeholder",
    "title": "Get List",
    "version": "1.0.0",
    "name": "getAll",
    "group": "Stakeholder",
    "permission": [
      {
        "name": "administrator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all stakeholders</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page which we want to get (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "perPage",
            "description": "<p>Item per page (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>Sort the list by a field (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filter",
            "description": "<p>filter the query data (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Text filter for data (N/A)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/stakeholder",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>the list of data</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "items",
            "description": "<p>{begin, end, total}</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "pages",
            "description": "<p>{current, prev, hasPrev, next, hasNext, total}</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>ok or fail</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>something from server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": [...],\n  \"items\": {\"begin\": 1, \"end\": 3, \"total\": 5},\n  \"pages\": {\"current\": 1, \"prev\": 3, \"hasPrev\": true, \"next\": 5, \"hasNext\": true, \"total\": 56},\n  \"result\": \"ok\",\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Stakeholder.js",
    "groupTitle": "Stakeholder"
  },
  {
    "type": "GET",
    "url": "/v1/auth/stakeholder/:id",
    "title": "Get One",
    "version": "1.0.0",
    "name": "getOne/getType",
    "group": "Stakeholder",
    "permission": [
      {
        "name": "type of user >= 3, if type < 3, just get the stakeholder they create"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get one stakeholder</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of stakeholder, on params</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/stakeholder/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of group</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "taxcode",
            "description": "<p>taxcode of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "district",
            "description": "<p>district of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "detailAddress",
            "description": "<p>detailAddress of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>phone of stakeholder</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of stakeholder</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\",\n         \"phone\": \"1213233453454\",\n         \"name\": \"ilovebioz@gmail.com\",\n         \"type\": \"1\",\n         ...\n     },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Stakeholder.js",
    "groupTitle": "Stakeholder"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/stakeholder/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "Stakeholder",
    "permission": [
      {
        "name": "Every type of user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update stakeholder information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of stakeholder (/laboratories, /companies), on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>name of company or lab</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "taxcode",
            "description": "<p>company or lab's taxcode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "district",
            "description": "<p>company or lab's district</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "detailaddress",
            "description": "<p>company or lab's detail address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>company or lab's phone</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>1: company <br/> 2: lab</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>status of stakeholder</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/stakeholder/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated stakeholder</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Stakeholder.js",
    "groupTitle": "Stakeholder"
  },
  {
    "type": "POST",
    "url": "/v1/auth/subcategory",
    "title": "Create One",
    "version": "1.0.0",
    "name": "create",
    "group": "SubCategory",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create subcategory by admin, moderator</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "subject",
            "description": "<p>subcategory's title</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "categoryid",
            "description": "<p>category's id</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/subcategory",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created subcategory</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Subcategory.js",
    "groupTitle": "SubCategory"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/subcategory/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "SubCategory",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete subcategory</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of subcategory</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/subcategory/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted subcategory</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Subcategory.js",
    "groupTitle": "SubCategory"
  },
  {
    "type": "GET",
    "url": "/v1/auth/subcategory",
    "title": "Get Statistic",
    "version": "1.0.0",
    "name": "getStatistic",
    "group": "SubCategory",
    "permission": [
      {
        "name": "All users"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get Statistic</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/subcategory",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "activated",
            "description": "<p>Subcategory work</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "deleted",
            "description": "<p>Subcategory deleted</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "total",
            "description": "<p>total of Subcategory</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\": {\n                \"activated\": 19,\n                \"deleted\": 0,\n                \"total\": 19\n            },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Subcategory.js",
    "groupTitle": "SubCategory"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/subcategory/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "SubCategory",
    "permission": [
      {
        "name": "administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update subcategory information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of subcategory, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "subject",
            "description": "<p>subcategory's title</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "categoryid",
            "description": "<p>category's id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>status of category</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/category/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated category</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/Subcategory.js",
    "groupTitle": "SubCategory"
  },
  {
    "type": "POST",
    "url": "/v1/users/create",
    "title": "Create new user",
    "version": "1.0.0",
    "name": "create",
    "group": "User",
    "permission": [
      {
        "name": "lab or company user"
      }
    ],
    "description": "<p>Create user, after that, system will send you a Email to verify your account</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>unique phone</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>unique email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>a string with 6 &lt;= length &lt;= 64</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>1: activated <br/> 0: deleted</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstName",
            "description": "<p>first name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>last name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>1: company <br/> 2: lab</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/users/create",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"result\": \"ok\",\n  \"message\": \"Please check your Email\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/v1/auth/users",
    "title": "Create by admin",
    "version": "1.0.0",
    "name": "createByAdmin",
    "group": "User",
    "permission": [
      {
        "name": "just administrator or moderator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Create user by admin or moderator</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>unique phone</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>unique email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>a string with 6 &lt;= length &lt;= 64</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>1: activated <br/> 0: deleted</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstName",
            "description": "<p>first name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "file",
            "optional": true,
            "field": "file",
            "description": "<p>image</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>last name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>1: company <br/> 2: lab <br/> 3: moderate <br/> 4: admin <br/> 5: superadmin</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/users",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of created user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n      \"id\": \"abc\"\n  },\n  \"result\": \"ok\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "DELETE",
    "url": "/v1/auth/users/:id",
    "title": "Delete One",
    "version": "1.0.0",
    "name": "delete",
    "group": "User",
    "permission": [
      {
        "name": "just admin user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>delete user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of user</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/users/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of deleted user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/v1/auth/users",
    "title": "Get List",
    "version": "1.0.0",
    "name": "getAll",
    "group": "User",
    "permission": [
      {
        "name": "administrator"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get all users</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page which we want to get (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "perPage",
            "description": "<p>Item per page (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>Sort the list by a field (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filter",
            "description": "<p>filter the query data (N/A)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Text filter for data (N/A)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/users",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>the list of data</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "items",
            "description": "<p>{begin, end, total}</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "pages",
            "description": "<p>{current, prev, hasPrev, next, hasNext, total}</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>ok or fail</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>something from server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": [...],\n  \"items\": {\"begin\": 1, \"end\": 3, \"total\": 5},\n  \"pages\": {\"current\": 1, \"prev\": 3, \"hasPrev\": true, \"next\": 5, \"hasNext\": true, \"total\": 56},\n  \"result\": \"ok\",\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/v1/auth/users/:id",
    "title": "Get One",
    "version": "1.0.0",
    "name": "getOne",
    "group": "User",
    "permission": [
      {
        "name": "Every type of user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Get one user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID of user, on params</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/users/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of group</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>phone of user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email of user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>displayName of user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\",\n         \"phone\": \"1213233453454\",\n         \"email\": \"ilovebioz@gmail.com\",\n         \"status\": \"1\",\n         ...\n     },\n     \"result\": \"ok\",\n     \"message\" \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/v1/login",
    "title": "Login",
    "version": "1.0.0",
    "name": "login",
    "group": "User",
    "permission": [
      {
        "name": "Every one"
      }
    ],
    "description": "<p>login and get access token</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userName",
            "description": "<p>a string with length &lt;= 64, can be a phone or email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>a string with 4 &lt; length &lt; 64</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/login",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>the user data with token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>ok or fail</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>something from server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\":{\n     \"token\": \"abc\",\n     \"id\":2,\n     \"loginName\": \"admin\",\n     \"phone\": \"0123456789\"\n     \"status\": 1\n     \"type\": 1\n  },\n  \"result\": \"ok\",\n  \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/users/:id",
    "title": "Update One",
    "version": "1.0.0",
    "name": "update",
    "group": "User",
    "permission": [
      {
        "name": "Every type of user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update user information</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of user, on params</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>type of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>status of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstName",
            "description": "<p>first name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>last name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "displayName",
            "description": "<p>displayName of user</p>"
          },
          {
            "group": "Parameter",
            "type": "file",
            "optional": true,
            "field": "file",
            "description": "<p>user's image</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/users/2",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"data\":{\n         \"id\": \"2\"\n     },\n     \"result\":\"ok\",\n     \"message\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/users/updatepassword",
    "title": "Update Password",
    "version": "1.0.0",
    "name": "update",
    "group": "User",
    "permission": [
      {
        "name": "Every type of user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Update user password</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>user's old password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>user's new password</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/users/updatepassword",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n            \"data\": {\n                \"id\": \"103\"\n            },\n            \"message\": \"ok\",\n            \"code\": \"0\"\n        }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "PUT",
    "url": "/v1/auth/users/deletes",
    "title": "Deletes list of account",
    "version": "1.0.0",
    "name": "update",
    "group": "User",
    "permission": [
      {
        "name": "Every type of user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>Delete list of user account</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ids",
            "description": "<p>account's list</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/auth/users/deletes",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the ID of updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n            \"data\": {\n                \"id\": \"103\"\n            },\n            \"message\": \"ok\",\n            \"code\": \"0\"\n        }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\":\"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/v1/verify/:token",
    "title": "Update Email's status after register",
    "version": "1.0.0",
    "name": "verifyAccount",
    "group": "User",
    "permission": [
      {
        "name": "Status < 3"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>json web token to access to data</p>"
          }
        ]
      }
    },
    "description": "<p>When user click to the link in Email, user's account status update to activated account</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>account's token</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/v1/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlck5hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJ0eXBlIjo1LCJwaG9uZSI6IjAxMjM0NTY3ODkiLCJhdmF0YXIiOiJodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS9kb2t4cTdkOWQvaW1hZ2UvdXBsb2FkL3YxNjA2MzYzNDU3L3VzZXIvdWVvZnNnMmRueTlwYm1lOGNsZ3kuanBnIiwiaWF0IjoxNjA3MDUyNzM2LCJleHAiOjE2MDkyMTI3MzZ9.R64P2doZXYlX_xblSPIlLpXVscPb8UXVPQK3REqdv1I",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"message\": \"ok\",\n            \"code\": \"0\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "invalid",
            "description": "<p>input data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"result\": \"fail\",\n  \"message\": \"invalid input\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/route/User.js",
    "groupTitle": "User"
  }
] });
