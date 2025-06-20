import React from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Cloud, 
  Activity, 
  Code, 
  GitBranch, 
  Shield,
  Terminal,
  Zap,
  Cpu,
  Network,
  Users,
  ArrowRight
} from "lucide-react";

export default function App() {
  const navigate = useNavigate();
  // Task progress data
  const tasks = [
    {
      id: "task-1",
      title: "Identity Reconciliation Backend",
      description: "Build /identify REST API with contact identity reconciliation logic",
      status: "in-progress",
      progress: 40, // Updated: Database schema (MYA-2) completed
      icon: Database,
      features: [
        "✅ PostgreSQL database schema and models",
        "🔄 REST API endpoint for identity reconciliation",
        "📋 Contact linking and merging logic",
        "⚡ Query optimization and error handling"
      ]
    },
    {
      id: "task-2", 
      title: "DevOps & Scalable Deployment",
      description: "Containerization, Kubernetes deployment, and CI/CD pipeline",
      status: "planned",
      progress: 0,
      icon: Cloud,
      features: [
        "Docker containerization with multi-stage builds",
        "Kubernetes deployment with HPA",
        "API versioning (v1.0, v1.1, v2.0)",
        "CI/CD pipeline with GitHub Actions"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in-progress": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "planned": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "COMPLETED";
      case "in-progress": return "IN PROGRESS";
      case "planned": return "PLANNED";
      default: return "UNKNOWN";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Glowing accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Terminal className="w-12 h-12 text-cyan-400 mr-4" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DevForge Studio
            </h1>
          </div>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Senior Full-Stack & DevOps Engineering Assignment • Two-Part Solution
          </p>
          
          <div className="flex items-center justify-center mt-8 space-x-8">
            <div className="flex items-center text-cyan-400">
              <Activity className="w-5 h-5 mr-2" />
              <span className="font-mono text-sm">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center text-green-400">
              <Zap className="w-5 h-5 mr-2" />
              <span className="font-mono text-sm">BUILD READY</span>
            </div>
            <div className="flex items-center text-purple-400">
              <Cpu className="w-5 h-5 mr-2" />
              <span className="font-mono text-sm">DEPLOY PREPARED</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-12">
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-400 flex items-center">
                <Network className="w-6 h-6 mr-3" />
                Mission Progress
              </CardTitle>
              <CardDescription className="text-gray-400">
                Overall completion status of the DevForge Studio assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-gray-300">TOTAL PROGRESS</span>
                  <span className="text-sm font-mono text-cyan-400">40%</span>
                </div>
                <Progress value={40} className="h-3 bg-gray-800" />
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">1</div>
                    <div className="text-sm text-gray-400 font-mono">TASKS COMPLETED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">2</div>
                    <div className="text-sm text-gray-400 font-mono">TASKS ACTIVE</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {tasks.map((task) => {
            const IconComponent = task.icon;
            return (
              <Card key={task.id} className="bg-gray-900/70 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">{task.title}</CardTitle>
                        <Badge className={`mt-1 font-mono text-xs ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 mt-2">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono text-gray-300">PROGRESS</span>
                        <span className="text-sm font-mono text-cyan-400">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2 bg-gray-800" />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-mono text-gray-300 mb-3">KEY FEATURES:</h4>
                      <ul className="space-y-2">
                        {task.features.map((feature, index) => {
                          const isCompleted = feature.startsWith('✅');
                          const isInProgress = feature.startsWith('🔄');
                          const featureText = feature.replace(/^[✅🔄📋⚡]\s*/, '');
                          
                          return (
                            <li key={index} className="flex items-start">
                              <div className={`w-1 h-1 rounded-full mt-2 mr-3 flex-shrink-0 ${
                                isCompleted ? 'bg-green-400' : 
                                isInProgress ? 'bg-cyan-400' : 
                                'bg-gray-500'
                              }`} />
                              <span className={`text-sm ${
                                isCompleted ? 'text-green-400' : 
                                isInProgress ? 'text-cyan-400' : 
                                'text-gray-400'
                              }`}>
                                {feature}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                      disabled={task.status === "planned"}
                    >
                      {task.status === "in-progress" ? "Continue Working" : "Coming Soon"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Sprint Status */}
        <div className="mb-12">
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-cyan-400 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Current Sprint Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-sm text-green-400 font-mono">MYA-2: Database Schema & Models</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">COMPLETED</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse" />
                    <span className="text-sm text-cyan-400 font-mono">MYA-1: Landing Page Dashboard</span>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">IN PROGRESS</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    <span className="text-sm text-purple-400 font-mono">MYA-3: /identify API Endpoint</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">NEXT</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-green-400 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Contact Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">Interactive dashboard for identity reconciliation and contact management</p>
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <span className="text-xs text-green-400 font-mono">DASHBOARD READY</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
                onClick={() => navigate('/ContactDashboard')}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Open Dashboard
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-purple-400 flex items-center">
                <GitBranch className="w-5 h-5 mr-2" />
                System Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">Architectural overview and system diagrams</p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-400 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Deployment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">Monitor deployment health and metrics</p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
