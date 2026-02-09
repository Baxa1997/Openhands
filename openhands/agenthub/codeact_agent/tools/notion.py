"""Notion tool for the CodeAct agent to interact with Notion bug tracking."""

from litellm import ChatCompletionToolParam, ChatCompletionToolParamFunctionChunk

from openhands.agenthub.codeact_agent.tools.prompt import refine_prompt

NOTION_LIST_BUGS_TOOL_NAME = 'notion_list_bugs'
NOTION_GET_BUG_TOOL_NAME = 'notion_get_bug'
NOTION_UPDATE_STATUS_TOOL_NAME = 'notion_update_bug_status'
NOTION_ADD_COMMENT_TOOL_NAME = 'notion_add_comment'

_LIST_BUGS_DESCRIPTION = """List bugs/issues from a Notion database.

This tool retrieves bugs from a configured Notion database. You can filter bugs by status 
(e.g., 'Todo', 'In Progress', 'Done') to find bugs that need to be fixed.

### Usage
* Use this tool at the start of a bug-fixing session to see available bugs
* Filter by status='Todo' to get bugs that haven't been started
* Each bug includes: title, description, status, priority, and page_id

### Best Practices
* Always list bugs before attempting to fix them
* Use the page_id from the results when updating bug status
"""

_GET_BUG_DESCRIPTION = """Get detailed information about a specific bug from Notion.

This tool retrieves full details of a bug/issue by its Notion page ID.

### Usage
* Use this after listing bugs to get more details about a specific bug
* The page_id parameter should be from a previous notion_list_bugs call
"""

_UPDATE_STATUS_DESCRIPTION = """Update the status of a bug in Notion.

This tool updates the status of a bug (e.g., marking it as 'In Progress' or 'Done') 
after you've started working on it or completed the fix.

### Usage
* Use 'In Progress' when you start working on a bug
* Use 'Done' after you've successfully fixed the bug and verified the fix
* Use 'Blocked' if you cannot proceed with the fix

### Best Practices
* Always update status to 'In Progress' before starting work
* Only mark as 'Done' after verifying your fix works (e.g., tests pass)
"""

_ADD_COMMENT_DESCRIPTION = """Add a comment to a bug in Notion.

This tool adds a comment to a bug page, useful for documenting your progress,
findings, or the solution you implemented.

### Usage
* Add comments to explain what you found or what you fixed
* Document any important decisions or technical details
"""


def create_notion_list_bugs_tool() -> ChatCompletionToolParam:
    """Create the tool for listing bugs from Notion."""
    return ChatCompletionToolParam(
        type='function',
        function=ChatCompletionToolParamFunctionChunk(
            name=NOTION_LIST_BUGS_TOOL_NAME,
            description=refine_prompt(_LIST_BUGS_DESCRIPTION),
            parameters={
                'type': 'object',
                'properties': {
                    'status_filter': {
                        'type': 'string',
                        'description': refine_prompt(
                            "Optional. Filter bugs by status. Common values: 'Todo', 'In Progress', 'Done', 'Blocked'. "
                            "Leave empty to get all bugs."
                        ),
                    },
                    'limit': {
                        'type': 'integer',
                        'description': 'Optional. Maximum number of bugs to return. Default is 10.',
                        'default': 10,
                    },
                },
                'required': [],
            },
        ),
    )


def create_notion_get_bug_tool() -> ChatCompletionToolParam:
    """Create the tool for getting a specific bug from Notion."""
    return ChatCompletionToolParam(
        type='function',
        function=ChatCompletionToolParamFunctionChunk(
            name=NOTION_GET_BUG_TOOL_NAME,
            description=refine_prompt(_GET_BUG_DESCRIPTION),
            parameters={
                'type': 'object',
                'properties': {
                    'page_id': {
                        'type': 'string',
                        'description': 'The Notion page ID of the bug to retrieve.',
                    },
                },
                'required': ['page_id'],
            },
        ),
    )


def create_notion_update_status_tool() -> ChatCompletionToolParam:
    """Create the tool for updating bug status in Notion."""
    return ChatCompletionToolParam(
        type='function',
        function=ChatCompletionToolParamFunctionChunk(
            name=NOTION_UPDATE_STATUS_TOOL_NAME,
            description=refine_prompt(_UPDATE_STATUS_DESCRIPTION),
            parameters={
                'type': 'object',
                'properties': {
                    'page_id': {
                        'type': 'string',
                        'description': 'The Notion page ID of the bug to update.',
                    },
                    'status': {
                        'type': 'string',
                        'description': refine_prompt(
                            "The new status. Common values: 'Todo', 'In Progress', 'Done', 'Blocked'."
                        ),
                    },
                },
                'required': ['page_id', 'status'],
            },
        ),
    )


def create_notion_add_comment_tool() -> ChatCompletionToolParam:
    """Create the tool for adding comments to bugs in Notion."""
    return ChatCompletionToolParam(
        type='function',
        function=ChatCompletionToolParamFunctionChunk(
            name=NOTION_ADD_COMMENT_TOOL_NAME,
            description=refine_prompt(_ADD_COMMENT_DESCRIPTION),
            parameters={
                'type': 'object',
                'properties': {
                    'page_id': {
                        'type': 'string',
                        'description': 'The Notion page ID of the bug to comment on.',
                    },
                    'comment': {
                        'type': 'string',
                        'description': 'The comment text to add.',
                    },
                },
                'required': ['page_id', 'comment'],
            },
        ),
    )


def get_all_notion_tools() -> list[ChatCompletionToolParam]:
    """Get all Notion-related tools."""
    return [
        create_notion_list_bugs_tool(),
        create_notion_get_bug_tool(),
        create_notion_update_status_tool(),
        create_notion_add_comment_tool(),
    ]
