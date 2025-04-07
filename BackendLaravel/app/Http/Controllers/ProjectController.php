<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,ongoing,completed'
        ]);
        $project = Project::create($request->all());

        return response()->json($project, 201);
    }

    public function show($id)
    {
        return Project::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->all());

        return response()->json($project);
    }

    public function destroy($id)
    {
        Project::findOrFail($id)->delete();
        return response()->json(['message' => 'Project deleted']);
    }

    public function taskSummary($projectId)
{
    $project = Project::with(['tasks' => function ($query) {
        $query->orderBy('created_at', 'desc');
    }])->findOrFail($projectId);

    $taskCounts = [
        'total' => $project->tasks->count(),
        'pending' => $project->tasks->where('status', 'pending')->count(),
        'ongoing' => $project->tasks->where('status', 'ongoing')->count(),
        'completed' => $project->tasks->where('status', 'completed')->count(),
        'latest' => $project->tasks->take(5),  // Fetch 5 latest tasks
    ];

    return response()->json($taskCounts);
}
}

