// Import the necessary modules and functions
import Swal from 'sweetalert2';
import { ajax as _ajax } from 'jquery';
import { EliminarCuenta } from '../views/profile.ejs';


// Mock the necessary dependencies
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('jquery', () => ({
  ajax: jest.fn(),
}));

// Describe the test suite
describe('EliminarCuenta', () => {
  it('should show confirmation dialog and delete account', () => {
    // Mock the response from the AJAX request
    const ajaxResponse = {
      comprobacionEliminado: true,
    };

    // Mock the SweetAlert fire method
    Swal.fire.mockResolvedValue({
      isConfirmed: true,
    });

    // Mock the AJAX request
    _ajax.mockImplementationOnce((options) => {
      const successCallback = options.success;
      successCallback(ajaxResponse);
    });

    // Call the function under test
    EliminarCuenta();

    // Expect the SweetAlert fire method to be called with the confirmation dialog parameters
    expect(Swal.fire).toHaveBeenCalledWith({
      title: '¿Confirma la eliminación de su cuenta?',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    });

    // Expect the AJAX request to be called with the correct URL and method
    expect(_ajax).toHaveBeenCalledWith({
      url: '/dashboard/lista/eliminar/' + '<%=datosUsuario.idUsuario%>',
      method: 'put',
      success: expect.any(Function),
      error: expect.any(Function),
    });

    // Expect the success message to be displayed if the account is successfully deleted
    expect(Swal.fire).toHaveBeenCalledWith('¡Tu cuenta ha sido eliminada!');

    // Expect the logout function to be called after the account is deleted
    expect(window.location).toBe('/logout');
  });

  it('should show error message if there are pending processes', () => {
    // Mock the response from the AJAX request
    const ajaxResponse = {
      comprobacionEliminado: false,
    };

    // Mock the SweetAlert fire method
    Swal.fire.mockResolvedValue({
      isConfirmed: true,
    });

    // Mock the AJAX request
    _ajax.mockImplementationOnce((options) => {
      const successCallback = options.success;
      successCallback(ajaxResponse);
    });

    // Call the function under test
    EliminarCuenta();

    // Expect the error message to be displayed if there are pending processes
    expect(Swal.fire).toHaveBeenCalledWith(
      'Tiene procesos pendientes de concluir. Reasignelos o complételos para continuar.'
    );

    // Expect the logout function not to be called
    expect(window.location).not.toBe('/logout');
  });
});
