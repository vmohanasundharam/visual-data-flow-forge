// Core types for the Visual Pipeline Builder

export interface DataSource {
  id: string;
  name: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  value?: any;
  type: 'number' | 'string' | 'boolean' | 'object';
}

export interface Field {
  id: string;
  name: string;
  value: any;
  type: 'number' | 'string' | 'boolean' | 'object';
}

export interface GlobalVariable {
  id: string;
  name: string;
  value: any;
  type: 'number' | 'string' | 'list' | 'map';
}

export interface JSFunction {
  id: string;
  name: string;
  description?: string;
  arguments: {
    name: string;
    type: 'number' | 'string' | 'list' | 'map';
  }[];
  returnType: 'number' | 'string' | 'list' | 'map';
  code: string;
}

export interface Condition {
  id: string;
  source: string; // Reference to field/tag/variable
  sourceType: 'field' | 'tag' | 'variable';
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=' | 'contains' | 'is' | 'isn\'t';
  value: any;
  valueType: 'literal' | 'reference';
  valueRef?: string; // If valueType is reference
}

export interface FlowNode {
  id: string;
  type: 'if' | 'javascript' | 'start' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    config?: any;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type?: string;
}

export type TriggerType = 'polling' | 'schedule' | 'webhook';

export interface CronOption {
  label: string;
  value: string;
  description: string;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfig: {
    dataSourceId?: string; // For polling
    cronExpression?: string; // For schedule
    webhookUrl?: string; // For webhook
  };
  dataSourceId?: string;
  globalVariables: GlobalVariable[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IfBlockConfig {
  conditions: Condition[];
  grouping?: string; // Parentheses grouping expression
  logicOperator: 'AND' | 'OR';
}

export interface JavaScriptBlockConfig {
  functionId: string;
  argumentMappings: {
    argumentName: string;
    source: string;
    sourceType: 'field' | 'tag' | 'variable';
  }[];
  returnMappings: {
    returnKey: string;
    targetVariable: string;
  }[];
}