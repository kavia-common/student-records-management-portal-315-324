#!/bin/bash
cd /tmp/kavia/workspace/code-generation/student-records-management-portal-315-324/student_record_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

