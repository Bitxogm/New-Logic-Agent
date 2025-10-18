// frontend/src/data/codeTemplates.ts

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  category: 'function' | 'class' | 'loop' | 'array' | 'string' | 'other';
}

export const codeTemplates: CodeTemplate[] = [
  // ========================================
  // PYTHON TEMPLATES
  // ========================================
  {
    id: 'py-function',
    name: 'Function Template',
    description: 'Basic function structure',
    language: 'python',
    category: 'function',
    code: `def function_name(param1, param2):
    """
    Description of what the function does.
    
    Args:
        param1: Description of param1
        param2: Description of param2
    
    Returns:
        Description of return value
    """
    # Your code here
    pass`
  },
  {
    id: 'py-class',
    name: 'Class Template',
    description: 'Basic class structure',
    language: 'python',
    category: 'class',
    code: `class ClassName:
    """Class description."""
    
    def __init__(self, param1, param2):
        """Initialize the class."""
        self.param1 = param1
        self.param2 = param2
    
    def method_name(self):
        """Method description."""
        pass`
  },
  {
    id: 'py-for-loop',
    name: 'For Loop',
    description: 'Iterate over a list',
    language: 'python',
    category: 'loop',
    code: `for item in items:
    # Process each item
    print(item)`
  },
  {
    id: 'py-while-loop',
    name: 'While Loop',
    description: 'Loop with condition',
    language: 'python',
    category: 'loop',
    code: `while condition:
    # Loop body
    pass`
  },
  {
    id: 'py-list-comprehension',
    name: 'List Comprehension',
    description: 'Create list from iterable',
    language: 'python',
    category: 'array',
    code: `result = [expression for item in iterable if condition]`
  },
  {
    id: 'py-try-except',
    name: 'Error Handling',
    description: 'Try-except block',
    language: 'python',
    category: 'other',
    code: `try:
    # Code that might raise an exception
    pass
except Exception as e:
    # Handle the exception
    print(f"Error: {e}")`
  },

  // ========================================
  // JAVASCRIPT TEMPLATES
  // ========================================
  {
    id: 'js-function',
    name: 'Function Template',
    description: 'Basic function structure',
    language: 'javascript',
    category: 'function',
    code: `function functionName(param1, param2) {
    // Your code here
    return result;
}`
  },
  {
    id: 'js-arrow-function',
    name: 'Arrow Function',
    description: 'Modern arrow function',
    language: 'javascript',
    category: 'function',
    code: `const functionName = (param1, param2) => {
    // Your code here
    return result;
};`
  },
  {
    id: 'js-class',
    name: 'Class Template',
    description: 'ES6 class structure',
    language: 'javascript',
    category: 'class',
    code: `class ClassName {
    constructor(param1, param2) {
        this.param1 = param1;
        this.param2 = param2;
    }
    
    methodName() {
        // Method body
    }
}`
  },
  {
    id: 'js-for-loop',
    name: 'For Loop',
    description: 'Traditional for loop',
    language: 'javascript',
    category: 'loop',
    code: `for (let i = 0; i < array.length; i++) {
    // Process array[i]
    console.log(array[i]);
}`
  },
  {
    id: 'js-for-of',
    name: 'For...of Loop',
    description: 'Iterate over iterable',
    language: 'javascript',
    category: 'loop',
    code: `for (const item of items) {
    // Process each item
    console.log(item);
}`
  },
  {
    id: 'js-map',
    name: 'Array Map',
    description: 'Transform array elements',
    language: 'javascript',
    category: 'array',
    code: `const result = array.map(item => {
    // Transform item
    return transformedItem;
});`
  },
  {
    id: 'js-filter',
    name: 'Array Filter',
    description: 'Filter array elements',
    language: 'javascript',
    category: 'array',
    code: `const result = array.filter(item => {
    // Return true to keep item
    return condition;
});`
  },
  {
    id: 'js-reduce',
    name: 'Array Reduce',
    description: 'Reduce array to single value',
    language: 'javascript',
    category: 'array',
    code: `const result = array.reduce((accumulator, item) => {
    // Update accumulator
    return accumulator + item;
}, initialValue);`
  },
  {
    id: 'js-try-catch',
    name: 'Error Handling',
    description: 'Try-catch block',
    language: 'javascript',
    category: 'other',
    code: `try {
    // Code that might throw an error
} catch (error) {
    // Handle the error
    console.error('Error:', error.message);
}`
  },

  // ========================================
  // TYPESCRIPT TEMPLATES
  // ========================================
  {
    id: 'ts-function',
    name: 'Typed Function',
    description: 'Function with type annotations',
    language: 'typescript',
    category: 'function',
    code: `function functionName(param1: string, param2: number): ReturnType {
    // Your code here
    return result;
}`
  },
  {
    id: 'ts-interface',
    name: 'Interface',
    description: 'Type definition',
    language: 'typescript',
    category: 'other',
    code: `interface InterfaceName {
    property1: string;
    property2: number;
    optionalProperty?: boolean;
}`
  },

  // ========================================
  // JAVA TEMPLATES
  // ========================================
  {
    id: 'java-method',
    name: 'Method Template',
    description: 'Basic method structure',
    language: 'java',
    category: 'function',
    code: `public ReturnType methodName(Type1 param1, Type2 param2) {
    // Your code here
    return result;
}`
  },
  {
    id: 'java-class',
    name: 'Class Template',
    description: 'Basic class structure',
    language: 'java',
    category: 'class',
    code: `public class ClassName {
    private Type field1;
    private Type field2;
    
    public ClassName(Type field1, Type field2) {
        this.field1 = field1;
        this.field2 = field2;
    }
    
    public ReturnType methodName() {
        // Method body
        return result;
    }
}`
  },
  {
    id: 'java-for-loop',
    name: 'For Loop',
    description: 'Traditional for loop',
    language: 'java',
    category: 'loop',
    code: `for (int i = 0; i < array.length; i++) {
    // Process array[i]
    System.out.println(array[i]);
}`
  },
  {
    id: 'java-enhanced-for',
    name: 'Enhanced For Loop',
    description: 'For-each loop',
    language: 'java',
    category: 'loop',
    code: `for (Type item : items) {
    // Process each item
    System.out.println(item);
}`
  },

  // ========================================
  // C++ TEMPLATES
  // ========================================
  {
    id: 'cpp-function',
    name: 'Function Template',
    description: 'Basic function structure',
    language: 'cpp',
    category: 'function',
    code: `ReturnType functionName(Type1 param1, Type2 param2) {
    // Your code here
    return result;
}`
  },
  {
    id: 'cpp-class',
    name: 'Class Template',
    description: 'Basic class structure',
    language: 'cpp',
    category: 'class',
    code: `class ClassName {
private:
    Type field1;
    Type field2;
    
public:
    ClassName(Type f1, Type f2) : field1(f1), field2(f2) {}
    
    ReturnType methodName() {
        // Method body
        return result;
    }
};`
  },
  {
    id: 'cpp-for-loop',
    name: 'For Loop',
    description: 'Traditional for loop',
    language: 'cpp',
    category: 'loop',
    code: `for (int i = 0; i < n; i++) {
    // Loop body
    cout << i << endl;
}`
  },
  {
    id: 'cpp-vector-loop',
    name: 'Vector Loop',
    description: 'Range-based for loop',
    language: 'cpp',
    category: 'loop',
    code: `for (const auto& item : vector) {
    // Process each item
    cout << item << endl;
}`
  },
];

/**
 * Get templates for a specific language
 */
export function getTemplatesByLanguage(language: string): CodeTemplate[] {
  return codeTemplates.filter(t => t.language.toLowerCase() === language.toLowerCase());
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): CodeTemplate | undefined {
  return codeTemplates.find(t => t.id === id);
}