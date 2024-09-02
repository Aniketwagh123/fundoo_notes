# Java OOP Concepts

Java, as an object-oriented programming (OOP) language, is built on the following key principles: encapsulation, inheritance, polymorphism, and abstraction. These principles help create modular, reusable, and maintainable code.

## 1. Class and Object

**Class:** A class is a blueprint or template for creating objects.

```java
public class Car {
    String color;
    int year;

    void displayInfo() {
        System.out.println("Color: " + color + ", Year: " + year);
    }
}
```

- **Characteristics:**
  - **Instantiation:** Can be instantiated to create objects.
  - **Attributes and Methods:** Defines properties (attributes) and behaviors (methods) that objects created from the class can use.
  - **Constructors:** Can have constructors to initialize objects.

**Object:** An object is an instance of a class. When a constructer is called, an object is created. Each object has its own state and behavior defined by the class.

```java
public class Main {
    public static void main(String[] args) {
        Car car1 = new Car();  // Object creation
        car1.color = "Red";
        car1.year = 2021;
        car1.displayInfo();  // Output: Color: Red, Year: 2021
    }
}
```

- **Characteristics:**
  - Has its own state (values of attributes) defined by the class.
  - Can perform actions (methods) defined by the class.

## 2. Encapsulation

Encapsulation is the mechanism of wrapping data (variables) and methods together as a single unit. This is one of the fundamental principles of OOP.

**Data Hiding:** This refers to restricting access to certain methods and attributes of an object. By making variables private, you can hide them from outside access and control how they're accessed or modified through public getter and setter methods.

**Data Binding:** This is the process of binding the data members (attributes) and methods (functions) together in a single unit, known as an object. It ensures that data and the methods that manipulate data are tightly bound.

Example of Encapsulation:

```java
public class Person {
    // Private data members (Data Hiding)
    private String name;
    private int age;

    // Public getter method for name
    public String getName() {
        return name;
    }

    // Public setter method for name
    public void setName(String name) {
        this.name = name;
    }

    // Public getter method for age
    public int getAge() {
        return age;
    }

    // Public setter method for age
    public void setAge(int age) {
        if(age > 0) {  // Adding validation
            this.age = age;
        } else {
            System.out.println("Please enter a valid age.");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        // Creating an object of Person (Data Binding)
        Person person = new Person();

        // Setting values using setter methods
        person.setName("John");
        person.setAge(30);

        // Accessing values using getter methods
        System.out.println("Name: " + person.getName());
        System.out.println("Age: " + person.getAge());
    }
}

```

## 3. Inheritance

Inheritance is a mechanism where one class can inherit properties and methods from another class, promoting code reuse.

Example of Inheritance:

```java
// Parent class
class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

// Child class
class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks.");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat();   // Inherited method
        dog.bark();  // Own method
    }
}
```

- **Characteristics:**
  - **Reusability:** Allows reuse of existing code.
  - **Single/Multiple Inheritance:** Java Supports single inheritance (one parent class) and multiple inheritance through interfaces.
  - **Access to Parent Members:** Subclasses have access to public and protected members of the parent class.

## 4. Polymorphism

Polymorphism means "many forms" and it has 2 types as follow

**1) Compile-time Polymorphism (Method Overloading):** This occurs when multiple methods have the same name but different parameters within the same class.

```java
public class MathOperations {
    // Method with two int parameters
    int add(int a, int b) {
        return a + b;
    }

    // Overloaded method with three int parameters
    int add(int a, int b, int c) {
        return a + b + c;
    }
}

public class Main {
    public static void main(String[] args) {
        MathOperations mo = new MathOperations();
        System.out.println(mo.add(5, 10));       // Output: 15
        System.out.println(mo.add(5, 10, 15));   // Output: 30
    }
}
```

**2) Runtime Polymorphism (Method Overriding):** This happens when a subclass provides a specific implementation of a method that is already defined in its superclass.

trick: number of prams and type of prams and return type are all same but diffrent body

```java
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Cat meows");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myCat = new Cat();  // Upcasting
        myCat.sound();  // Output: Cat meows
    }
}
```

## 5. Abstraction

Abstraction is the concept of hiding the complex implementation details and showing only the essential features of an object. Java provides two ways to achieve abstraction: abstract classes and interfaces.

**Abstract Class:** A class that cannot be instantiated and can have both abstract (without implementation) and concrete methods (with implementation).

```java
abstract class Animal {
    abstract void makeSound();  // Abstract method

    void sleep() {
        System.out.println("Animal sleeps");  // Concrete method
    }
}


class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.makeSound();  // Output: Dog barks
        dog.sleep();      // Output: Animal sleeps
    }
}
```

**Interface:** An interface is a reference type in Java that is similar to a class. It is a collection of abstract methods (without implementations). A class implements an interface.

```java
interface Animal {
    void makeSound();  // Abstract method
}

class Dog implements Animal {
    public void makeSound() {
        System.out.println("Dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.makeSound();  // Output: Dog barks
    }
}
```

- **Characteristics:**
  - **Abstract Class:**
    - **Cannot Instantiate:** Cannot be instantiated directly.
    - **Abstract Methods:** Can contain abstract methods (without implementations/body).
    - **Concrete Methods:** Can have methods with implementations/body.
    - **Inheritance:** Can be extended by other classes.
  - **Interface:**
    - **Cannot Instantiate:** Cannot be instantiated directly.
    - **Abstract Methods:** Methods are abstract by default.
    - **Fields:** All fields are public, static, and final by default.
    - **Implementation:** Classes can implement interfaces
