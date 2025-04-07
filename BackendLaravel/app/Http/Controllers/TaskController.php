<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    //  Get all tasks for a specific project
    public function index($projectId)
    {
        $project = Project::findOrFail($projectId);
        $tasks = $project->tasks;
        return response()->json($tasks);
    }

    //  Create a new task for a project
    public function store(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,ongoing,completed',
        ]);

        $task = $project->tasks()->create($validated);

        return response()->json($task, 201);
    }

    //  Update a specific task
    public function update(Request $request, $projectId, $taskId)
    {
        $project = Project::findOrFail($projectId);
        $task = $project->tasks()->findOrFail($taskId);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:pending,ongoing,completed',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    //  Delete a task
    public function destroy($projectId, $taskId)
    {
        $project = Project::findOrFail($projectId);
        $task = $project->tasks()->findOrFail($taskId);

        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}
