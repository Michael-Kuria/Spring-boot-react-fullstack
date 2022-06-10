package com.michael.SpringBootAndReact.student;

import com.michael.SpringBootAndReact.student.exception.BadRequestException;
import com.michael.SpringBootAndReact.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    public void addStudent(Student student){
        Boolean existsEmail = studentRepository.selectExistsEmail(student.getEmail());

        if(existsEmail){
            throw new BadRequestException("Email " + student.getEmail() +" is taken");
        }

        studentRepository.save(student);
    }

    public void deleteStudent(Long id){

        if(!studentRepository.existsById(id))
            throw new StudentNotFoundException("Student with id = " + id +" doesn't exist");

        studentRepository.deleteById(id);
    }
}
